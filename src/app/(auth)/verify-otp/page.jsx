'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../../../components/Loading.jsx';

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please sign up again.');
      router.push('/auth/signup');
    }
  }, [email, router]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/users/verify-otp', {
        email,
        otp: otpValue
      });
      
      toast.success(res.data.message || 'Account verified successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.error || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/users/resend-otp', { email });
      toast.success(res.data.message || 'OTP sent successfully!');
      setResendDisabled(true);
      setCountdown(30);
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.error || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Auth form section */}
      <div className="w-full h-screen overflow-y-auto py-12">
        <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 py-0">
            <div className="text-center">
              <a href="/">
               <img
                  alt="amenses logo"
                  src="/images/logo.png"
                  className="mx-auto h-10 w-auto bg-black p-1"
                />
              </a>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Verify Your Email
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a verification code to {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="mt-8 space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent 
                  bg-indigo-600 hover:bg-indigo-700 cursor-pointer py-2 px-4 text-sm font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Verify Account
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-indigo-600 hover:underline hover:text-indigo-500'} cursor-pointer`}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </p>
            </div>

            <div className="text-center text-sm">
              <button
                onClick={() => router.push('/auth/signup')}
                className="font-medium text-indigo-600 cursor-pointer hover:underline hover:text-indigo-500"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading && <Loading />}
    </div>
  );
}