from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import date

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    category: str
    total_copies: int = Field(gt=0, description="Total number of copies")

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: str
    available_copies: int
    issued_copies: int = 0

class MemberBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class MemberCreate(MemberBase):
    pass

class Member(MemberBase):
    id: str
    joined_date: str

class TransactionCreate(BaseModel):
    book_id: str
    member_id: str

class Transaction(BaseModel):
    id: str
    book_id: str
    member_id: str
    issue_date: str
    due_date: str
    return_date: Optional[str] = None
    fine: float = 0.0
    status: str  # "issued", "returned"
