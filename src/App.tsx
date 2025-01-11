import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './pages/dashboard/index';
import ListView from './pages/tasks/ListView';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks/list" element={<ListView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;