// src/App.jsx
import React, { useState } from 'react';
import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './pages/Signup';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthed, setIsAuthed] = useState(
    !!localStorage.getItem('accessToken')
  );

  useEffect(() => {
    const accessToken   = localStorage.getItem('accessToken');
    const rememberToken = localStorage.getItem('rememberToken');

    // if no valid accessToken, try auto-login
    if (!accessToken && rememberToken) {
      api.get('/auth/auto-login', {
        headers: { rememberToken }
      })
      .then(res => {
        localStorage.setItem('accessToken', res.data.accessToken);
        setIsAuthed(true);
      })
      .catch(() => {
        // both tokens invalid → force logout
        localStorage.clear();
        setIsAuthed(false);
      });
    } else if (accessToken) {
      setIsAuthed(true);
    }
  }, [setIsAuthed]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route
            path="/signup"
            element={isAuthed ? <Navigate replace to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/login"
            element={isAuthed ? <Navigate replace to="/dashboard" /> : <Login />}
          />
          <Route
            path="/otp-verify"
            element={
              isAuthed
                ? <Navigate replace to="/dashboard" />
                : <OtpVerify setIsAuthed={setIsAuthed} />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthed
                ? <Dashboard setIsAuthed={setIsAuthed} />
                : <Navigate replace to="/login" />
            }
          />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
