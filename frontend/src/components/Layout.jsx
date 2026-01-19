import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="app-container">
            <aside className="sidebar">
                <h2>📚 LibManager</h2>
                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/books" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Books
                    </NavLink>
                    <NavLink to="/members" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Members
                    </NavLink>
                    <NavLink to="/issue-return" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Issue / Return
                    </NavLink>
                </nav>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
