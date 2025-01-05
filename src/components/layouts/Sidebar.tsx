import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    History,
    BarChart2,
    Calendar
} from 'lucide-react';

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
    },
    {
        name: 'Planning',
        path: '/calendar',
        icon: Calendar
    }
];

const Sidebar = () => {
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

    const isCurrentPath = (path: string) => {
        return location.pathname === path;
    };

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] top-16">
            <nav className="h-full py-4">
                <div className="px-4 space-y-1">
                    {navigation.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = isCurrentPath(item.path);
                        const hasChildren = item.children && item.children.length > 0;
                        const isOpen = openSubmenu === item.name;

                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => hasChildren ? toggleSubmenu(item.name) : null}
                                    className={`
                    w-full flex items-center px-3 py-2 text-sm rounded-xl
                    ${isActive ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                                >
                                    <IconComponent className="h-5 w-5 mr-3" />
                                    <span>{item.name}</span>
                                </button>

                                {/* Sous-menu */}
                                {hasChildren && isOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={child.path}
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