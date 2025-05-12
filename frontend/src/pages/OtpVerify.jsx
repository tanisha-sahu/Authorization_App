// src/pages/OtpVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

export default function OtpVerify({ setIsAuthed }) {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const realOtp = localStorage.getItem('otp'); // test OTP

  // if already logged in, bounce to dashboard
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleVerify = async () => {
    try {
      const { accessToken, rememberToken } = (await api.post('/auth/verify-otp', { email, otp })).data;

      

      toast.success('✅ OTP Verified, logging in…');
      localStorage.setItem('accessToken', accessToken);
       localStorage.setItem('rememberToken', rememberToken);
      setIsAuthed(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP invalid';
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center">OTP Verification</h2>

        {/* Testing OTP display */}
        <p className="text-gray-600 text-sm text-center">
          (For testing) Your OTP is:{' '}
          <span className="font-mono text-blue-600">{realOtp}</span>
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
          />
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
