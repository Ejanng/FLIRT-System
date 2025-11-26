import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '../components/ToastProvider';
import { Layout } from '../components/Layout';
import { Home } from '../pages/Home';
import { ReportItem } from '../pages/ReportItem';
import { ClaimItem } from '../pages/ClaimItem';
import { AdminDashboard } from '../pages/AdminDashboard';
import { About } from '../pages/About';
import { Auth } from '../pages/Auth';

/**
 * FLIRT App - Main Application Component
 * 
 * Mobile-first Lost and Found application for CCIS students
 * Features:
 * - HashRouter for static hosting compatibility
 * - Responsive Layout component with navigation
 * - Toast notifications for user feedback
 * - Separate Auth route (no layout)
 * - Protected admin route (future: add auth check)
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth route - no layout wrapper */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Main application routes - wrapped in Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/report" element={<Layout><ReportItem /></Layout>} />
        <Route path="/claim" element={<Layout><ClaimItem /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Global toast notification provider */}
      <ToastProvider />
    </Router>
  );
}
