import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { APP_CONFIG } from '@/utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <BrandLogo size="md" />
            <p className="mt-3 text-sm text-slate-500 max-w-sm">
              {APP_CONFIG.tagline} A centralized university service enabling students, faculty, and campus staff to report, track, and recover misplaced belongings.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All campus buildings monitored • Verified university directory</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-navy-800 uppercase tracking-wider">
              Quick Access
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/browse" className="hover:text-royal-600 transition-colors">
                  Browse Lost & Found
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-royal-600 transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-royal-600 transition-colors">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-royal-600 transition-colors">
                  Student/Staff Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Academic context */}
          <div>
            <h4 className="text-xs font-semibold text-navy-800 uppercase tracking-wider">
              Support & Security
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <span className="text-slate-500">Campus Security Desk</span>
              </li>
              <li>
                <a href={`mailto:${APP_CONFIG.supportEmail}`} className="hover:text-royal-600 transition-colors">
                  {APP_CONFIG.supportEmail}
                </a>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Software Engineering CCA Project
                <br />
                Team CLF: Kuldeep, Ravindra, Prathikshaa, Meghana
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Campus Lost & Found. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Campus Safety Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
