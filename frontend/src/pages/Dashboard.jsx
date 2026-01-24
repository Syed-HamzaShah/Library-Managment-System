import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import { motion } from 'framer-motion';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_books: 0,
        total_members: 0,
        books_issued: 0,
        overdue_books: 0
    });

    const loadStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-gradient">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back to your library management system.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Books"
                    value={stats.total_books}
                    icon={<BookOpen className="w-6 h-6 text-primary" />}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="Total Members"
                    value={stats.total_members}
                    icon={<Users className="w-6 h-6 text-primary" />}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    title="Currently Issued"
                    value={stats.books_issued}
                    icon={<ArrowLeftRight className="w-6 h-6" />}
                    variant="accent"
                />
                <StatCard
                    title="Overdue Books"
                    value={stats.overdue_books}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    variant="warning"
                />
            </div>

            {/* Quick Actions and Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <Button asChild>
                            <Link to="/issue-return">Issue a Book</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link to="/members">Add Member</Link>
                        </Button>
                    </div>
                </div>

                {/* Placeholder for future content or charts */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="text-sm text-muted-foreground">System Status</span>
                            <span className="font-semibold text-success">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="text-sm text-muted-foreground">Last Backed Up</span>
                            <span className="font-semibold">Today</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
