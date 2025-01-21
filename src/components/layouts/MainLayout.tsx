import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useMobileMenu } from './MobileMenuContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header fixe en haut */}
            <Header />

            {/* Layout principal avec sidebar et contenu */}
            <div className="flex flex-1 pt-16">
                {/* Overlay pour mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-gray-800/50 z-40 lg:hidden"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* Sidebar */}
                <Sidebar />

                {/* Contenu principal avec défilement */}
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;