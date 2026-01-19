import React, { useEffect, useState } from 'react';
import { getTransactions, issueBook, returnBook, getBooks, getMembers } from '../services/api';

const IssueReturn = () => {
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);

    // Issue Form State
    const [issueData, setIssueData] = useState({ book_id: '', member_id: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [txData, booksData, membersData] = await Promise.all([
            getTransactions(),
            getBooks(),
            getMembers()
        ]);
        setTransactions(txData);
        setBooks(booksData);
        setMembers(membersData);
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            await issueBook(issueData);
            alert("Book issued successfully!");
            setIssueData({ book_id: '', member_id: '' });
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || "Error issuing book");
        }
    };

    const handleReturn = async (txId) => {
        try {
            const result = await returnBook(txId);
            if (result.fine > 0) {
                alert(`Book returned. Late fine: $${result.fine}`);
            } else {
                alert("Book returned successfully.");
            }
            loadData();
        } catch (error) {
            alert(error.response?.data?.detail || "Error returning book");
        }
    };

    return (
        <div>
            <h1>Issue & Return</h1>

            <div className="card">
                <h3>Issue Book</h3>
                <form onSubmit={handleIssue} style={{ marginTop: '1rem' }}>
                    <div className="flex gap-4">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Select Book</label>
                            <select
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
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Select Member</label>
                            <select
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
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary">Issue Book</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3>Transaction History</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Member ID</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Fine</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice().reverse().map(tx => (
                                <tr key={tx.id}>
                                    <td><small>{tx.book_id}</small></td>
                                    <td><small>{tx.member_id}</small></td>
                                    <td>{new Date(tx.issue_date).toLocaleDateString()}</td>
                                    <td>{new Date(tx.due_date).toLocaleDateString()}</td>
                                    <td>{tx.return_date ? new Date(tx.return_date).toLocaleDateString() : '-'}</td>
                                    <td>${tx.fine}</td>
                                    <td>
                                        <span className={tx.status === 'issued' ? 'text-primary' : 'text-success'}>
                                            {tx.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {tx.status === 'issued' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleReturn(tx.id)}>
                                                Return
                                            </button>
                                        )}
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

export default IssueReturn;
