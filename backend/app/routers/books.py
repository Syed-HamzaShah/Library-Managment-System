from fastapi import APIRouter, HTTPException
from typing import List, Optional
import uuid
from app.models import Book, BookCreate
from app.data_handler import read_data, write_data

router = APIRouter(prefix="/books", tags=["books"])

@router.get("/", response_model=List[Book])
def get_books(search: Optional[str] = None):
    books = read_data("books")
    if search:
        search = search.lower()
        books = [
            b for b in books 
            if search in b["title"].lower() or 
               search in b["author"].lower() or 
               search in b["isbn"].lower() or 
               search in b["category"].lower()
        ]
    return books

@router.post("/", response_model=Book)
def create_book(book: BookCreate):
    books = read_data("books")
    
    # Check ISBN uniqueness
    if any(b["isbn"] == book.isbn for b in books):
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    new_book = book.model_dump()
    new_book["id"] = str(uuid.uuid4())
    new_book["available_copies"] = book.total_copies
    new_book["issued_copies"] = 0
    
    books.append(new_book)
    write_data("books", books)
    return new_book

@router.put("/{book_id}", response_model=Book)
def update_book(book_id: str, book_update: BookCreate):
    books = read_data("books")
    for i, book in enumerate(books):
        if book["id"] == book_id:
            updated_book = book_update.model_dump()
            updated_book["id"] = book_id
            # Preserve copy counts logic needs care. 
            # Simplified: Reset available based on new total and existing issued
            issued = book["issued_copies"]
            if updated_book["total_copies"] < issued:
                 raise HTTPException(status_code=400, detail="Total copies cannot be less than issued copies")
            
            updated_book["issued_copies"] = issued
            updated_book["available_copies"] = updated_book["total_copies"] - issued
            
            books[i] = updated_book
            write_data("books", books)
            return updated_book
    raise HTTPException(status_code=404, detail="Book not found")

@router.delete("/{book_id}")
def delete_book(book_id: str):
    books = read_data("books")
    new_books = [b for b in books if b["id"] != book_id]
    if len(books) == len(new_books):
        raise HTTPException(status_code=404, detail="Book not found")
        
    # Prevent deleting if books are issued? 
    # For now, allow deletion, but in a real app check transactions.
    
    write_data("books", new_books)
    return {"message": "Book deleted successfully"}
