import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { DevTools } from './components/DevTools';
import { Home } from './pages/Home';
import { ReportItem } from './pages/ReportItem';
import { ClaimItem } from './pages/ClaimItem';
import { AdminDashboard } from './pages/AdminDashboard';
import { About } from './pages/About';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth route without layout */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Main routes with layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<ReportItem />} />
                <Route path="/claim" element={<ClaimItem />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <ToastProvider />
        <DevTools />
      </Router>
    </AuthProvider>
  );
}