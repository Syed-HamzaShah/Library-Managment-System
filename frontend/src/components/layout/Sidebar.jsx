import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ArrowLeftRight,
    Settings,
    ChevronLeft,
    ChevronRight,
    Library,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Books', path: '/books' },
    { icon: Users, label: 'Members', path: '/members' },
    { icon: ArrowLeftRight, label: 'Issue/Return', path: '/issue-return' },
    // { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-50"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                    <Library className="w-6 h-6 text-sidebar-primary-foreground" />
                </div>
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h1 className="font-display text-xl font-bold text-sidebar-foreground">LibraryHub</h1>
                            <p className="text-xs text-sidebar-foreground/60">Management System</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                        isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                                            : 'hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground'
                                    )}
                                >
                                    <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-sidebar-primary-foreground')} />
                                    <AnimatePresence mode="wait">
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="font-medium"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-sidebar-border">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
