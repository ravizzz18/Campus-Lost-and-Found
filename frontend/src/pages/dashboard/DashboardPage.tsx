import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { ItemReport } from '@/types';
import { formatDate } from '@/utils/formatters';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ReportsService.getPublicReports()
      .then((data) => {
        if (mounted) {
          setReports(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Compute stats dynamically from actual data
  const userReports = reports.filter((r) => r.reporterId === user?.id || r.reporterName === user?.name);
  const activeLostCount = userReports.filter((r) => r.type === 'lost' && r.status !== 'resolved').length;
  const activeFoundCount = userReports.filter((r) => r.type === 'found' && r.status !== 'resolved').length;
  const resolvedCount = userReports.filter((r) => r.status === 'resolved').length;
  const totalCount = userReports.length;

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
            Role: <strong className="text-navy-800 uppercase">{user?.role}</strong> • Campus ID: {user?.campusId || 'STU-VERIFIED'} • Department: {user?.department || 'General'}
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

      {/* Overview Stat Cards (Computed dynamically) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Active Lost Reports
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">{activeLostCount}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Active Found Reports
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">{activeFoundCount}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-royal-50 text-royal-600 rounded-xl flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total Reports Filed
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">{totalCount}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Resolved &amp; Returned
            </span>
            <div className="text-2xl font-bold text-navy-800 mt-0.5">{resolvedCount}</div>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Recent Filings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-800">My Reports &amp; Filings</h2>
            <Link to="/my-reports" className="text-xs font-semibold text-royal-600 hover:underline">
              Manage in My Reports →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Loading user activity..." />
          ) : userReports.length > 0 ? (
            <div className="space-y-4">
              {userReports.slice(0, 4).map((item) => (
                <Card key={item.id} hoverEffect className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                        {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                      {item.status === 'resolved' && (
                        <Badge variant="resolved">Resolved</Badge>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-navy-800">{item.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-royal-500" />
                      {item.location} • Filed on {formatDate(item.dateReported)}
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
          ) : (
            <Card className="p-8 text-center bg-white border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-navy-800">No reports filed yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Misplaced an item or found belongings on campus? File a report to initiate recovery.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link to="/report-lost">
                  <Button variant="primary" size="sm">Report Lost Item</Button>
                </Link>
                <Link to="/report-found">
                  <Button variant="outline" size="sm">Report Found Item</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Actions & Guidelines */}
        <div className="space-y-6">
          {isAdmin && (
            <Card className="p-6 bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Moderation Desk</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                You have administrative moderator privileges. Inspect flagged listings and verify ownership claims.
              </p>
              <div className="mt-4">
                <Link to="/admin/flagged-reports">
                  <Button variant="danger" size="sm" className="w-full">
                    Open Moderation Queue
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-base font-semibold text-navy-800 mb-2">Campus Security Contact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For high-value items (wallets with cash, identification badges, laptops) deposited with security staff, visit Administrative Block Room 102.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link to="/browse">
                <Button variant="outline" size="sm" className="w-full" leftIcon={<Search className="w-4 h-4" />}>
                  Search Campus Directory
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-navy-900 text-white">
            <h3 className="text-base font-semibold text-white mb-2">Recovery Etiquette</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Once an item has been returned, please mark your listing as "Resolved" so campus peers can focus on active reports.
            </p>
            <Link to="/my-reports">
              <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Manage My Reports
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
