import { Search, Bell, Settings } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed w-full top-0 z-30">
            <div className="h-full flex items-center justify-between px-6">
                {/* Logo et titre */}
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
                </div>

                {/* Barre de recherche */}
                <div className="flex-1 max-w-2xl mx-8">
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
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Settings className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;