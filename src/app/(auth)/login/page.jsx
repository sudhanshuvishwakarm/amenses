'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../../../components/Loading.jsx';
export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const onSignin = async (e) => {
    e.preventDefault();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login', user);
      console.log(res.data);
      toast.success('Login successful');
      router.push('/dashboard');
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      router.push('/');
    }
  };
  useEffect(() => {
      if (user.email.length > 0 && user.password.length >= 8) {
        setButtonDisabled(false);
      }
      else {
        setButtonDisabled(true);
      }
    }, [user])
  return (
    <div className="flex min-h-screen">
      {/* Auth form section */}
      <div className="w-full  flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
         <a href="/">
            <img
                  alt="amenses logo"
                  src="/images/logo.png"
                  className="mx-auto h-10 w-auto bg-black p-1"
                />
         </a>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h1>
          </div>

          <form onSubmit={onSignin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email address
              </label>
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className={`group relative flex w-full justify-center rounded-md border border-transparent 
                  ${buttonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} 
                  py-2 px-4 text-sm font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => router.push('/signup')}
              className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline hover:text-indigo-500"
            >
              Create new account
            </button>
            <button
              onClick={() => router.push('/admin/login')}
              className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline hover:text-indigo-500"
            >
              Admin login
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="#"
                className="w-full inline-flex justify-center gap-2 items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <i className="fa-brands text-xl fa-google"></i>
                <span>Google</span>
              </a>
              <a
                href="#"
                className="w-full inline-flex justify-center gap-2 items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <i className="fa-brands text-xl fa-github"></i>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
 {loading && (
        <Loading/>
      )}   
    </div>
  );
}