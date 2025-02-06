import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './pages/dashboard/index';
import ListView from './pages/tasks/ListView';
import KanbanView from './pages/tasks/KanbanView';
import CalendarView from './pages/tasks/CalendarView';
import EisenhowerView from './pages/tasks/EisenhowerView';
import ObjectivesPage from './pages/objectives/index';
import HabitsPage from './pages/habits/index';
import StatsOverview from './pages/stats/index';
import { MobileMenuProvider } from './components/layouts/MobileMenuContext';
import TradingDashboard from './pages/trading/index';
import ExercisesView from './pages/workout/ExercisesView';
import WorkoutIndexView from './pages/workout';
import SessionView from './pages/workout/SessionView';


function App() {
  return (
    <Router>
      <MobileMenuProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks/list" element={<ListView />} />
            <Route path="/tasks/kanban" element={<KanbanView />} />
            <Route path="/tasks/calendar" element={<CalendarView />} />
            <Route path="/tasks/matrix" element={<EisenhowerView />} />
            <Route path="/objectives" element={<ObjectivesPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/stats" element={<StatsOverview />} />
            <Route path="/trading" element={<TradingDashboard />} />
            <Route path="/workout" element={<WorkoutIndexView />} />
            <Route path="/workout/session/:id" element={<SessionView />} />
            <Route path="/workout/exercises" element={<ExercisesView />} />


          </Routes>
        </MainLayout>
      </MobileMenuProvider>
    </Router>
  );
}

export default App;