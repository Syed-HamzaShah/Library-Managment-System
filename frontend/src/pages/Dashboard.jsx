import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_books: 0,
        total_members: 0,
        books_issued: 0,
        overdue_books: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Books</span>
                    <span className="stat-value">{stats.total_books}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Members</span>
                    <span className="stat-value">{stats.total_members}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Active Issues</span>
                    <span className="stat-value" style={{ color: 'var(--primary)' }}>{stats.books_issued}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Overdue Books</span>
                    <span className="stat-value" style={{ color: 'var(--danger)' }}>{stats.overdue_books}</span>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Quick Actions</h3>
                <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                    <a href="/issue-return" className="btn btn-primary">Issue a Book</a>
                    <a href="/books" className="btn btn-primary" style={{ backgroundColor: '#10b981' }}>Add New Book</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
