import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard/index';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <main className="p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;