// src/pages/dashboard/index.tsx
import DashboardWidgets from './DashboardWidgets';

const DashboardPage = () => {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <DashboardWidgets />
        </div>
    );
};

export default DashboardPage;