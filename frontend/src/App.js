import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SchoolHome from './pages/SchoolHome';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TakeExam from './pages/TakeExam';
import ViewResult from './pages/ViewResult';
import { Toaster } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<SchoolHome />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
            <Route 
              path="/student" 
              element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/teacher" 
              element={user && user.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/exam/:examId" 
              element={user && user.role === 'student' ? <TakeExam /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/result/:resultId" 
              element={user ? <ViewResult /> : <Navigate to="/login" />} 
            />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
