import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

export function MainLayout({ children }) {
    const [sidebarWidth, setSidebarWidth] = useState(280);

    useEffect(() => {
        const handleResize = () => {
            const sidebar = document.querySelector('aside');
            if (sidebar) {
                setSidebarWidth(sidebar.getBoundingClientRect().width);
            }
        };

        const observer = new ResizeObserver(handleResize);
        const sidebar = document.querySelector('aside');
        if (sidebar) observer.observe(sidebar);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarWidth }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="min-h-screen p-8"
            >
                {children}
            </motion.main>
        </div>
    );
}
