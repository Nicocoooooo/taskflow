import { Search, Bell, Settings, Menu } from 'lucide-react';
import { useMobileMenu } from './MobileMenuContext';

const Header = () => {
    const { toggleMobileMenu } = useMobileMenu();

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed w-full top-0 z-30">
            <div className="h-full flex items-center justify-between px-4 lg:px-6">
                {/* Logo, titre et menu mobile */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 lg:hidden hover:bg-gray-100 rounded-xl"
                    >
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
                </div>

                {/* Barre de recherche */}
                <div className="hidden md:block flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-xl md:hidden">
                        <Search className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl">
                        <Settings className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;