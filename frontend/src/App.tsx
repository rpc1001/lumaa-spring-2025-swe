import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import { AuthContext } from './context/AuthContext';

import { JSX } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to={token ? "/tasks" : "/login"} replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;