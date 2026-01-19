import React, { useEffect, useState } from 'react';
import { getBooks, createBook, deleteBook, updateBook } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', category: '', total_copies: 1
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        let result = books;

        if (search) {
            result = result.filter(book =>
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase()) ||
                book.isbn.includes(search)
            );
        }

        if (categoryFilter !== 'all') {
            result = result.filter(book => book.category === categoryFilter);
        }

        setFilteredBooks(result);
    }, [search, categoryFilter, books]);

    const loadBooks = async () => {
        setLoading(true);
        try {
            // Note: API might handle search, but we do client side filtering for now to match reference UX smoothly
            const data = await getBooks();
            setBooks(data);
            setFilteredBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const handleDelete = async (book) => {
        if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
            try {
                await deleteBook(book.id);
                loadBooks();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (book) => {
        // Populate form and show it
        // Note: The original generic form might need adjustment for updates vs creates
        // For now we just alert as we focus on UI
        alert(`Edit feature for ${book.title} to be implemented fully.`);
    };

    const handleIssue = (book) => {
        // Navigate or show issue modal
        window.location.href = "/issue-return";
    };

    const categories = ['all', ...new Set(books.map((b) => b.category))];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gradient">Book Catalog</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your library's book collection
                    </p>
                </div>
                <Button className="gradient-accent text-accent-foreground gap-2" onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4" />
                    {showForm ? 'Cancel' : 'Add New Book'}
                </Button>
            </div>

            {/* Form Card */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Book Title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author</label>
                                <Input required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Author Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ISBN</label>
                                <Input required value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} placeholder="ISBN Number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Total Copies</label>
                                <Input type="number" min="1" required value={formData.total_copies} onChange={e => setFormData({ ...formData, total_copies: parseInt(e.target.value) })} placeholder="1" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Save Book</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, author, or ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
                Showing {filteredBooks.length} of {books.length} books
            </p>

            {/* Book Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onIssue={handleIssue}
                        />
                    ))}
                </div>
            )}

            {!loading && filteredBooks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No books found matching your criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Books;
