import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    History,
    BarChart2,
    X
} from 'lucide-react';
import { useMobileMenu } from './MobileMenuContext';

const navigation = [
    {
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard
    },
    {
        name: 'Tâches',
        path: '/tasks',
        icon: CheckSquare,
        children: [
            { name: 'Liste', path: '/tasks/list' },
            { name: 'Kanban', path: '/tasks/kanban' },
            { name: 'Calendrier', path: '/tasks/calendar' },
            { name: 'Matrice', path: '/tasks/matrix' }
        ]
    },
    {
        name: 'Objectifs',
        path: '/objectives',
        icon: Target
    },
    {
        name: 'Habitudes',
        path: '/habits',
        icon: History
    },
    {
        name: 'Statistiques',
        path: '/stats',
        icon: BarChart2
    }
];

const Sidebar = () => {
    const location = useLocation();
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

    const isCurrentPath = (path: string) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    return (
        <aside
            className={`
                fixed top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out z-50
                w-72 lg:w-64
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Bouton fermer pour mobile */}
            <button
                onClick={closeMobileMenu}
                className="lg:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-xl"
            >
                <X className="h-5 w-5 text-gray-600" />
            </button>

            <nav className="h-full py-4 overflow-y-auto">
                <div className="px-4 space-y-1">
                    {navigation.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = isCurrentPath(item.path);
                        const hasChildren = item.children && item.children.length > 0;
                        const isOpen = openSubmenu === item.name;

                        return (
                            <div key={item.name}>
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`
                                            w-full flex items-center px-3 py-2 text-sm rounded-xl
                                            ${isActive ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'}
                                        `}
                                    >
                                        <IconComponent className="h-5 w-5 mr-3" />
                                        <span>{item.name}</span>
                                    </button>
                                ) : (
                                    <Link
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={`
                                            w-full flex items-center px-3 py-2 text-sm rounded-xl
                                            ${isActive ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'}
                                        `}
                                    >
                                        <IconComponent className="h-5 w-5 mr-3" />
                                        <span>{item.name}</span>
                                    </Link>
                                )}

                                {/* Sous-menu */}
                                {hasChildren && isOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={child.path}
                                                onClick={closeMobileMenu}
                                                className={`
                                                    block px-3 py-2 text-sm rounded-xl
                                                    ${isCurrentPath(child.path) ? 'text-violet-600' : 'text-gray-600 hover:text-gray-900'}
                                                `}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;