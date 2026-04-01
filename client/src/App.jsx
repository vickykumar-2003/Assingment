import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CharityList from './pages/CharityList';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Subscription from './pages/Subscription';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/charities" element={<CharityList />} />
<Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/subscribe" element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
