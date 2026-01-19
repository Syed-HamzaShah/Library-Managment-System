from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import books, members, transactions, dashboard

app = FastAPI(title="Library Management System API")


origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(members.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
