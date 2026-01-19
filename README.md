# Library Management System

A complete Library Management System built with **React** (Frontend) and **FastAPI** (Backend).
This project uses a local file system for data storage (JSON files), making it database-free and easy to run.

## 🚀 Features

### 📚 Book Management
- Add, Edit, Delete Books.
- Search by Title, Author, ISBN, Category.
- Track available vs total copies.

### 👤 Member Management
- Add, Edit, Remove Members.
- View member details and history.

### 🔄 Issue & Return
- Issue books to members.
- validations (e.g. check availability).
- Return books and calculate **Fines** automatically for late returns.

### 📊 Dashboard
- View total stats: Books, Members, Active Issues, Overdue Books.

## 📂 Project Structure

```
/backend
    /app
        /routers    # API Routes
        models.py   # Data Models
        data_handler.py # JSON File Utils
    /data           # JSON Storage (books.json, etc.)
    main.py         # Entry Point
/frontend
    /src
        /components
        /pages
        /services
    App.jsx         # Routing
    main.jsx        # Entry Point
```

## 🛠️ How to Run

### 1. Backend (Python/FastAPI)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will run at `http://localhost:8000`.

### 2. Frontend (React)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The App will run at `http://localhost:5173`.

## 📝 Notes
- **Data Persistence**: All data is saved in `backend/data/*.json`. You can backup these files to save the state.
- **Fine Calculation**: Fines are calculated at $5/day for overdue books.
