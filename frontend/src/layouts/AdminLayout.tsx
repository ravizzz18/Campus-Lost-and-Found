import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#050817]">
      <Navbar />
      
      {/* Admin Context Header */}
      <div className="bg-navy-950 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-600/20 text-rose-400 rounded-lg border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">Admin Moderation Desk</h1>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Restricted Area
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Review reported content, ownership verification claims, and manage campus safety flags.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/flagged-reports"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/admin/flagged-reports'
                    ? 'bg-royal-600 text-white'
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Flagged Queue</span>
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-1.5 text-xs font-medium bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to App</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
