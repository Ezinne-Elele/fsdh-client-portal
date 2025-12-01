import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import MFAVerification from './pages/Auth/MFAVerification';
import PasswordReset from './pages/Auth/PasswordReset';
import Dashboard from './pages/Dashboard/Dashboard';
import PortfolioValuation from './pages/Portfolio/PortfolioValuation';
import Instructions from './pages/Instructions/Instructions';
import InstructionDetail from './pages/Instructions/InstructionDetail';
import Statements from './pages/Statements/Statements';
import Notifications from './pages/Notifications/Notifications';
import RelationshipManagement from './pages/Relationship/RelationshipManagement';
import MandateManagement from './pages/Mandate/MandateManagement';
import Analytics from './pages/Analytics/Analytics';
import InstructionTracking from './pages/Tracking/InstructionTracking';
import AccountManagement from './pages/Account/AccountManagement';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/mfa-verify" element={<MFAVerification />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<PortfolioValuation />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="instructions/:id" element={<InstructionDetail />} />
        <Route path="statements" element={<Statements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="relationship" element={<RelationshipManagement />} />
        <Route path="mandates" element={<MandateManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="tracking" element={<InstructionTracking />} />
        <Route path="account" element={<AccountManagement />} />
      </Route>
    </Routes>
  );
}

export default App;

