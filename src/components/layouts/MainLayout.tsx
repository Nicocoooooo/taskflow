import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fixe en haut */}
            <Header />

            {/* Layout principal avec sidebar et contenu */}
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar fixe à gauche */}
                <Sidebar />

                {/* Contenu principal avec défilement */}
                <main className="flex-1 overflow-y-auto p-8 ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;