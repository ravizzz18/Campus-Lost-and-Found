import React, { useEffect, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, loginAsDemoUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => `
    inline-flex items-center text-sm font-medium transition-colors duration-150 px-3 py-1.5 rounded-md
    ${isActive(path) ? 'text-[#F2EEE8] bg-[#D9824B]/12 border border-[#D9824B]/30 font-semibold' : 'text-[#A29B91] hover:text-[#F2EEE8] hover:bg-[#22201D]'}
  `;

  return (
    <header className="sticky top-0 z-40 w-full px-0 transition-all duration-300">
      <div
        className={`mx-auto h-full transition-all duration-300 ${
          isScrolled
            ? 'mt-3 max-w-[calc(100%-2rem)] rounded-2xl border border-[#35312C]/90 bg-[#111110]/78 px-4 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:max-w-[calc(100%-3rem)] lg:max-w-7xl'
            : 'w-full border-b border-[#35312C] bg-[#111110]'
        }`}
      >
        <div className={`flex items-center justify-between h-16 ${
          isScrolled ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        }`}>
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
                <div className="relative">
                  <button
                    onClick={() => setDevMenuOpen(!devMenuOpen)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-white/[0.06]"
                  >
                    <span>{user?.role}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {devMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[#6F91FF]/20 bg-[#0A1024] py-1 text-left shadow-[0_18px_50px_rgba(0,0,0,0.35)] z-50">
                      <button
                        onClick={() => {
                          loginAsDemoUser('student');
                          setDevMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                      >
                        <span>Student View</span>
                        {user?.role === 'student' && <span className="text-royal-400 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          loginAsDemoUser('admin');
                          setDevMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                      >
                        <span>Admin View</span>
                        {user?.role === 'admin' && <span className="text-royal-400 font-bold">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setDevMenuOpen(false);
                        }}
                        className="w-full border-t border-white/[0.06] px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-400/[0.06]"
                      >
                        Logout to Public
                      </button>
                    </div>
                  )}
                </div>
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
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-400">
                  Public Mode
                </span>
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
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-royal-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#6F91FF]/10 bg-[#070B1C]/98 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.06] rounded-lg"
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
