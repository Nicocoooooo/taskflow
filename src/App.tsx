import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './pages/dashboard/index';
import ListView from './pages/tasks/ListView';
import KanbanView from './pages/tasks/KanbanView';
import CalendarView from './pages/tasks/CalendarView';
import EisenhowerView from './pages/tasks/EisenhowerView';
import ObjectivesPage from './pages/objectives/index';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks/list" element={<ListView />} />
          <Route path="/tasks/kanban" element={<KanbanView />} />
          <Route path="/tasks/calendar" element={<CalendarView />} />
          <Route path="/tasks/matrix" element={<EisenhowerView />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;