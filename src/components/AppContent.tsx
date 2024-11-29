import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AdminDashboard } from '../pages/AdminDashboard';
import { MemberDashboard } from '../pages/MemberDashboard';
import { PublicView } from '../pages/PublicView';
import { LoginForm } from './LoginForm';
import { LogIn, LogOut, Menu, X } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicRoute = location.pathname === '/';
  const isLoginRoute = location.pathname === '/login';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <nav className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex ${isPublicRoute ? 'justify-center' : 'justify-between'} h-16`}>
            <div className={`flex items-center ${isPublicRoute ? 'flex-grow justify-center' : ''}`}>
              <Link to="/" className={`text-3xl md:text-5xl font-extrabold text-gray-100 hover:text-blue-400 transition-colors ${isPublicRoute ? 'text-center' : ''}`}>
                SoniManic
              </Link>
              {isAuthenticated && (
                <div className="hidden md:flex ml-10 items-baseline space-x-4">
                  <Link
                    to="/member"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                  >
                    My Calendar
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300">
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                !isPublicRoute && !isLoginRoute && (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )
              )}
            </div>
            {!isPublicRoute && isAuthenticated && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-300 hover:text-white p-2"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && !isPublicRoute && isAuthenticated && (
          <div className="md:hidden border-t border-dark-700">
            <div className="pt-2 pb-3">
              {/* User Info Section */}
              <div className="px-4 py-2 border-b border-dark-700">
                <span className="block text-sm text-gray-400">Logged in as</span>
                <span className="block text-lg font-semibold text-white">{user?.name}</span>
              </div>

              {/* Navigation Section */}
              <div className="px-2 py-2 space-y-1">
                <Link
                  to="/member"
                  className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-dark-700 px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  My Calendar
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-dark-700 px-3 py-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Account Actions Section */}
              <div className="px-2 pt-2 border-t border-dark-700">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 text-red-400 hover:text-red-300 hover:bg-dark-700 px-3 py-2 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin"
            element={
              isAuthenticated && user?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/member"
            element={
              isAuthenticated ? <MemberDashboard /> : <PublicView />
            }
          />
        </Routes>
      </main>
    </div>
  );
};