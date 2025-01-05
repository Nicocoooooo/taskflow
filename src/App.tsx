import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './pages/dashboard/index';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;