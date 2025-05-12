// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ setIsAuthed }) {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

 const logout = async () => {
  const rememberToken = localStorage.getItem('rememberToken');

  try {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rememberToken}`,
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }

  localStorage.clear();
  setIsAuthed(false);
  navigate('/login', { replace: true });
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center space-y-6">
        <h2 className="text-2xl font-semibold">Welcome!</h2>
        <p className="text-gray-700">You’re logged in as:</p>
        <p className="font-mono text-blue-600 break-all">{email}</p>
        <button
          onClick={logout}
          className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
