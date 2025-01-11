// src/pages/dashboard/index.tsx
import DashboardWidgets from './DashboardWidgets';

const DashboardPage = () => {
    return (
        <div className="p-8"> {/* Augmentation du padding */}
            <DashboardWidgets />
        </div>
    );
};

export default DashboardPage;