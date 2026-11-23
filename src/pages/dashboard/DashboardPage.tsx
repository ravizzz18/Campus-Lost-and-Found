import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { SAMPLE_REPORTS } from '@/services/mockData';
import { formatDate } from '@/utils/formatters';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Bell,
  MapPin,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // User-relevant reports (mock)
  const myReports = SAMPLE_REPORTS.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase font-semibold text-royal-600 tracking-wider">
            Campus Lost &amp; Found Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight mt-0.5">
            Welcome back, {user?.name || 'Campus Member'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Department: {user?.department || 'General Campus'} • ID: {user?.campusId || 'STU-VERIFIED'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report-lost">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Report Lost Item
            </Button>
          </Link>
          <Link to="/report-found">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
            >
              Report Found Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Active Lost Reports
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">1</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Active Found Reports
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">1</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-royal-50 text-royal-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total Submissions
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">2</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Ownership Inquiries
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">0</div>
          </div>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Recent Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-800">My Recent Filings</h2>
            <Link to="/my-reports" className="text-xs font-semibold text-royal-600 hover:underline">
              View all filings →
            </Link>
          </div>

          <div className="space-y-4">
            {myReports.map((item) => (
              <Card key={item.id} hoverEffect className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                    <span className="text-xs text-slate-400">• {formatDate(item.dateReported)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-navy-800">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-royal-500" />
                    {item.location}
                  </p>
                </div>

                <div className="flex sm:flex-col justify-end items-end gap-2 flex-shrink-0">
                  <Link to={`/item/${item.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Guidance & Direct Links */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-navy-800 mb-2">Campus Security Notice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-value items (laptops, jewelry, student ID cards) can also be deposited with the Central Campus Security desk in Administrative Block room 102.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link to="/browse">
                <Button variant="outline" size="sm" className="w-full" leftIcon={<Search className="w-4 h-4" />}>
                  Search Campus Directory
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h3 className="text-base font-semibold text-white mb-2">Have you found an item?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Reporting found belongings quickly increases recovery rates by over 80% on campus.
            </p>
            <Link to="/report-found">
              <Button variant="primary" size="sm" className="w-full">
                File a Found Report
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
