import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { AppShell } from './components/layout/AppShell';

// Pages
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Batches } from './pages/Batches';
import { Cards } from './pages/Cards';
import { CardDetails } from './pages/CardDetails';
import { QRGenerator } from './pages/QRGenerator';
import { Scanner } from './pages/Scanner';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { TestCardView } from './pages/TestCardView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Phase 1 Test Dynamic URL Card Route */}
            <Route path="/c/:publicToken" element={<TestCardView />} />

            {/* Public Login */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated CRM Shell */}
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/cards/:id" element={<CardDetails />} />
              <Route path="/qr-generator" element={<QRGenerator />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              {/* Default fallback for unknown routes inside shell */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
