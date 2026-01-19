from fastapi import APIRouter
from app.data_handler import read_data
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_stats():
    books = read_data("books")
    members = read_data("members")
    transactions = read_data("transactions")
    
    total_books = len(books)
    total_members = len(members)
    active_issued = sum(1 for t in transactions if t["status"] == "issued")
    
    now = datetime.now()
    overdue_books = sum(
        1 for t in transactions 
        if t["status"] == "issued" and datetime.fromisoformat(t["due_date"]) < now
    )
    
    return {
        "total_books": total_books,
        "total_members": total_members,
        "books_issued": active_issued,
        "overdue_books": overdue_books
    }
