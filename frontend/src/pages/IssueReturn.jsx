import React, { useEffect, useState } from 'react';
import { getTransactions, issueBook, returnBook, getBooks, getMembers } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock, Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { cn } from '../lib/utils';

const statusConfig = {
    issued: { icon: ArrowUpRight, color: 'text-primary', bg: 'bg-primary/10', badge: 'bg-primary text-primary-foreground' },
    returned: { icon: ArrowDownLeft, color: 'text-success', bg: 'bg-success/10', badge: 'bg-success text-success-foreground' },
    overdue: { icon: Clock, color: 'text-destructive', bg: 'bg-destructive/10', badge: 'bg-destructive text-destructive-foreground' },
};

const IssueReturn = () => {
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Issue Form State
    const [issueData, setIssueData] = useState({ book_id: '', member_id: '' });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let result = transactions;

        if (searchQuery) {
            result = result.filter((tx) => {
                const book = books.find((b) => b.id === tx.book_id);
                const member = members.find((m) => m.id === tx.member_id);
                return (
                    (book && book.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (member && member.name.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            });
        }

        if (statusFilter !== 'all') {
            // Basic status mapping since user API might not return 'overdue' explicitly in status field, or assumes client calc. 
            // User API returns 'issued' or 'returned'. Overdue is logic based on due_date. 
            // Ideally API updates status. For now we filter by exact string unless we implement overdue logic check.
            result = result.filter((tx) => tx.status === statusFilter);
        }

        setFilteredTransactions(result);
    }, [searchQuery, statusFilter, transactions, books, members]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [txData, booksData, membersData] = await Promise.all([
                getTransactions(),
                getBooks(),
                getMembers()
            ]);
            setTransactions(txData);
            setBooks(booksData);
            setMembers(membersData);
            setFilteredTransactions(txData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            await issueBook(issueData);
            alert("Book issued successfully!");
            setIssueData({ book_id: '', member_id: '' });
            setShowIssueForm(false);
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || "Error issuing book");
        }
    };

    const handleReturn = async (txId) => {
        try {
            const result = await returnBook(txId);
            let message = "Book returned successfully.";
            if (result.fine > 0) {
                message = `Book returned. Late fine: $${result.fine}`;
            }
            alert(message);
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || "Error returning book");
        }
    };

    const getBook = (id) => books.find((b) => b.id === id);
    const getMember = (id) => members.find((m) => m.id === id);

    // Helper to determine display status (inject overdue if needed)
    const getDisplayStatus = (tx) => {
        // If status is issued but date is past due, we could call it overdue visually
        if (tx.status === 'issued' && new Date(tx.due_date) < new Date()) {
            return 'overdue';
        }
        return tx.status;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gradient">Transactions</h1>
                    <p className="text-muted-foreground mt-1">
                        Track book issues, returns, and overdue items
                    </p>
                </div>
                <Button className="gradient-accent text-accent-foreground gap-2" onClick={() => setShowIssueForm(!showIssueForm)}>
                    <Plus className="w-4 h-4" />
                    {showIssueForm ? 'Cancel' : 'Issue New Book'}
                </Button>
            </div>

            {/* Issue Form Card */}
            {showIssueForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-4">Issue Book</h2>
                    <form onSubmit={handleIssue} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Book</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={issueData.book_id}
                                    onChange={e => setIssueData({ ...issueData, book_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Book --</option>
                                    {books.filter(b => b.available_copies > 0).map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.title} (Available: {b.available_copies})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Member</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={issueData.member_id}
                                    onChange={e => setIssueData({ ...issueData, member_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Member --</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Issue Book</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', statusConfig.issued.bg)}>
                        <ArrowUpRight className={cn('w-5 h-5', statusConfig.issued.color)} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{transactions.filter((t) => t.status === 'issued').length}</p>
                        <p className="text-sm text-muted-foreground">Currently Issued</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', statusConfig.returned.bg)}>
                        <ArrowDownLeft className={cn('w-5 h-5', statusConfig.returned.color)} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{transactions.filter((t) => t.status === 'returned').length}</p>
                        <p className="text-sm text-muted-foreground">Returned</p>
                    </div>
                </div>
                {/* Overdue stat calculation */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', statusConfig.overdue.bg)}>
                        <Clock className={cn('w-5 h-5', statusConfig.overdue.color)} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">
                            {transactions.filter(t => t.status === 'issued' && new Date(t.due_date) < new Date()).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Overdue</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by book title or member name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="issued">Issued</TabsTrigger>
                        <TabsTrigger value="returned">Returned</TabsTrigger>
                        {/* <TabsTrigger value="overdue">Overdue</TabsTrigger> */}
                        {/* Overdue filter logic would require custom filtering since API status is just 'issued' */}
                    </TabsList>
                </Tabs>
            </div>

            {/* Transaction Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-secondary/50">
                                    <th className="text-left p-4 font-medium text-muted-foreground">Book</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Member</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Issue Date</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Due Date</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Fine</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.slice().reverse().map((transaction, index) => {
                                    const book = getBook(transaction.book_id);
                                    const member = getMember(transaction.member_id);
                                    const displayStatus = getDisplayStatus(transaction);
                                    const statusStyle = statusConfig[displayStatus];
                                    const StatusIcon = statusStyle.icon;

                                    return (
                                        <motion.tr
                                            key={transaction.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-border hover:bg-secondary/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn('p-2 rounded-lg', statusStyle.bg)}>
                                                        <StatusIcon className={cn('w-4 h-4', statusStyle.color)} />
                                                    </div>
                                                    <span className="font-medium">{book?.title || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {member ? `${member.name}` : 'Unknown'}
                                            </td>
                                            <td className="p-4 text-muted-foreground">{new Date(transaction.issue_date).toLocaleDateString()}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(transaction.due_date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <Badge className={cn(statusStyle.badge, 'capitalize')}>
                                                    {displayStatus}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {transaction.fine > 0 ? (
                                                    <span className="text-destructive font-medium">
                                                        ${transaction.fine.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {transaction.status === 'issued' && (
                                                    <Button
                                                        size="sm"
                                                        variant={displayStatus === 'overdue' ? 'destructive' : 'outline'}
                                                        onClick={() => handleReturn(transaction.id)}
                                                    >
                                                        {displayStatus === 'overdue' ? 'Return & Pay' : 'Return'}
                                                    </Button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions found matching your criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default IssueReturn;
