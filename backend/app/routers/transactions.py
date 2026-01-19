from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timedelta
from app.models import Transaction, TransactionCreate
from app.data_handler import read_data, write_data

router = APIRouter(prefix="/transactions", tags=["transactions"])

FINE_PER_DAY = 5.0  # Configurable fine
ISSUE_DAYS = 7     # Days before late

@router.post("/issue", response_model=Transaction)
def issue_book(transaction_data: TransactionCreate):
    books = read_data("books")
    members = read_data("members")
    transactions = read_data("transactions")

    # Validate book
    book_idx = next((i for i, b in enumerate(books) if b["id"] == transaction_data.book_id), None)
    if book_idx is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if books[book_idx]["available_copies"] <= 0:
        raise HTTPException(status_code=400, detail="Book is not available")

    # Validate member
    if not any(m["id"] == transaction_data.member_id for m in members):
        raise HTTPException(status_code=404, detail="Member not found")

    # Create Transaction
    issue_date = datetime.now()
    due_date = issue_date + timedelta(days=ISSUE_DAYS)
    
    new_transaction = {
        "id": str(uuid.uuid4()),
        "book_id": transaction_data.book_id,
        "member_id": transaction_data.member_id,
        "issue_date": issue_date.isoformat(),
        "due_date": due_date.isoformat(),
        "return_date": None,
        "fine": 0.0,
        "status": "issued"
    }

    # Update book counts
    books[book_idx]["available_copies"] -= 1
    books[book_idx]["issued_copies"] += 1

    transactions.append(new_transaction)
    
    write_data("books", books)
    write_data("transactions", transactions)
    
    return new_transaction

@router.post("/return/{transaction_id}", response_model=Transaction)
def return_book(transaction_id: str):
    transactions = read_data("transactions")
    books = read_data("books")
    
    tx_idx = next((i for i, t in enumerate(transactions) if t["id"] == transaction_id), None)
    if tx_idx is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    transaction = transactions[tx_idx]
    if transaction["status"] == "returned":
        raise HTTPException(status_code=400, detail="Book already returned")

    # Calculate Fine
    return_date = datetime.now()
    due_date = datetime.fromisoformat(transaction["due_date"])
    
    fine = 0.0
    if return_date > due_date:
        overdue_days = (return_date - due_date).days
        fine = overdue_days * FINE_PER_DAY

    # Update Transaction
    transaction["return_date"] = return_date.isoformat()
    transaction["fine"] = max(0, fine)
    transaction["status"] = "returned"
    
    # Update Book Counts
    book_idx = next((i for i, b in enumerate(books) if b["id"] == transaction["book_id"]), None)
    if book_idx is not None:
        books[book_idx]["available_copies"] += 1
        books[book_idx]["issued_copies"] -= 1

    write_data("transactions", transactions)
    write_data("books", books)
    
    return transaction

@router.get("/", response_model=List[Transaction])
def get_transactions():
    return read_data("transactions")
