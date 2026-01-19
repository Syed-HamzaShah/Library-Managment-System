import React, { useEffect, useState } from 'react';
import { getBooks, createBook, deleteBook, updateBook } from '../services/api';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', category: '', total_copies: 1
    });

    useEffect(() => {
        loadBooks();
    }, [search]);

    const loadBooks = async () => {
        try {
            const data = await getBooks(search);
            setBooks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBook(formData);
            setShowForm(false);
            setFormData({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
            loadBooks();
        } catch (error) {
            alert(error.response?.data?.detail || "Error creating book");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteBook(id);
                loadBooks();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1>Book Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Book'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Author</label>
                                <input required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>ISBN</label>
                                <input required value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Category</label>
                                <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ width: '100px' }}>
                                <label>Copies</label>
                                <input type="number" min="1" required value={formData.total_copies} onChange={e => setFormData({ ...formData, total_copies: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Book</button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="form-group">
                    <input
                        placeholder="Search by title, author, ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Category</th>
                                <th>Avail / Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.category}</td>
                                    <td>
                                        <span className={book.available_copies > 0 ? "text-success" : "text-danger"}>
                                            {book.available_copies}
                                        </span>
                                        {' / '}
                                        {book.total_copies}
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Books;
