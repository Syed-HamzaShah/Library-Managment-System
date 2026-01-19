import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';

const Layout = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default Layout;
