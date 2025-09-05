

"use client"

import { useState, useEffect, useRef } from "react";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "./Loading";

export default function Header() {
  let data = []
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = async () => {
    setLoading(true);
    setShowProfileDropdown(false);
    try {
      const res = await axios.post('/api/users/logout');
      setMe(false);
      setLoading(false);
      toast.success('Logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.post('/api/users/profile');
        setMe(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (isMounted) {
          setMe(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };


  if (loading) {
    return (
      <header className="border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="hidden sm:block">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
          <Loading />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 md:p-6">
        {/* Logo Section */}
        <a
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Go to dashboard"
        >
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-30 h-auto object-contain bg-black"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold text-gray-900 leading-tight">EventPoll</span>
            <span className="text-xs text-gray-500 leading-tight">Plan. Poll. Decide.</span>
          </div>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Dashboard Link - Only show if authenticated */}
          {me && (
            <>
            <a
              href="/events/create"
              className="hidden md:block text-md text-black hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="events"
            >
              create event
            </a>
            </>
          )}

          {/* Authentication Section */}
          {me ? (
            // Authenticated User Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="User menu"
                aria-expanded={showProfileDropdown}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {me?.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">
                    {me?.user?.username.toUpperCase() || me?.user?.email || 'User'}
                  </span>
                </div>

                <ChevronDown className={`h-4 w-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {me?.user?.username?.charAt(0).toUpperCase() || me?.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {me?.user?.username.toUpperCase() || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {me?.user?.email || 'No email provided'}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile Settings
                    </a>
                    <button
                      onClick={onLogout}
                      disabled={loading}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4" />
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Login Button for Non-authenticated Users
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
              aria-label="Go to login"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
