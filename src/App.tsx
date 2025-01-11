import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './pages/dashboard/index';
import ListView from './pages/tasks/ListView';
import KanbanView from './pages/tasks/KanbanView';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks/list" element={<ListView />} />
          <Route path="/tasks/kanban" element={<KanbanView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;