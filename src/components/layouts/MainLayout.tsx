import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { MobileMenuProvider, useMobileMenu } from './MobileMenuContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayoutContent = ({ children }: MainLayoutProps) => {
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();

    // Ferme le menu mobile lors du changement de route
    useEffect(() => {
        closeMobileMenu();
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fixe en haut */}
            <Header />

            {/* Layout principal avec sidebar et contenu */}
            <div className="flex min-h-[calc(100vh-4rem)]">
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
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};

const MainLayout = (props: MainLayoutProps) => (
    <MobileMenuProvider>
        <MainLayoutContent {...props} />
    </MobileMenuProvider>
);

export default MainLayout;