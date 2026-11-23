import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import {
  Menu,
  X,
  PlusCircle,
  Search,
  LayoutDashboard,
  FileText,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, loginAsDemoUser, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => `
    inline-flex items-center text-sm font-medium transition-colors duration-150 px-3 py-1.5 rounded-md
    ${isActive(path) ? 'text-royal-600 bg-royal-50 font-semibold' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100/60'}
  `;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200/80">
      {/* Top Banner for dev milestone notice */}
      <div className="bg-navy-900 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-navy-800 flex items-center justify-between">
        <span className="hidden sm:inline">
          Official Campus Lost & Found System — Continuous Comprehensive Assessment (CCA)
        </span>
        <span className="sm:hidden text-[11px]">Campus Lost & Found Platform</span>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Logged in: <strong className="text-white">{user?.name}</strong> ({user?.role})
            </span>
          ) : (
            <span className="text-slate-400 text-xs">Public Mode</span>
          )}
          <div className="relative">
            <button
              onClick={() => setDevMenuOpen(!devMenuOpen)}
              className="text-[11px] bg-navy-800 hover:bg-navy-700 text-royal-300 px-2 py-0.5 rounded border border-navy-700 inline-flex items-center gap-1"
            >
              <span>Switch Role</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {devMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-elevated border border-slate-200 py-1 text-left z-50 text-navy-800">
                <button
                  onClick={() => {
                    loginAsDemoUser('student');
                    setDevMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Student View</span>
                  {user?.role === 'student' && <span className="text-royal-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser('admin');
                    setDevMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Admin View</span>
                  {user?.role === 'admin' && <span className="text-royal-600 font-bold">✓</span>}
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setDevMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                  >
                    Logout to Public
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/browse" className={navLinkClass('/browse')}>
              <Search className="w-4 h-4 mr-1.5" />
              Browse Items
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Link>
                <Link to="/report-lost" className={navLinkClass('/report-lost')}>
                  <PlusCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                  Report Lost
                </Link>
                <Link to="/report-found" className={navLinkClass('/report-found')}>
                  <PlusCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Report Found
                </Link>
                <Link to="/my-reports" className={navLinkClass('/my-reports')}>
                  <FileText className="w-4 h-4 mr-1.5" />
                  My Reports
                </Link>
                {isAdmin && (
                  <Link to="/admin/flagged-reports" className={navLinkClass('/admin')}>
                    <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/report-lost" className={navLinkClass('/report-lost')}>
                  Report Lost
                </Link>
                <Link to="/report-found" className={navLinkClass('/report-found')}>
                  Report Found
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm" leftIcon={<User className="w-4 h-4" />}>
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  title="Sign out"
                  className="text-slate-500 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Items
          </Link>
          <Link
            to="/report-lost"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2 text-amber-600" />
            Report Lost
          </Link>
          <Link
            to="/report-found"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2 text-emerald-600" />
            Report Found
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-100 my-2 pt-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/my-reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Reports
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/flagged-reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-lg"
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Flagged Reports (Admin)
                  </Link>
                )}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="primary" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
