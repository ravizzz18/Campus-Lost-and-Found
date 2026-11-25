
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { ItemReport } from '@/types';
import { formatDate, formatCategory } from '@/utils/formatters';
import {
  FileText,
  PlusCircle,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { user } = useAuth();

  const [reports, setReports] = useState<ItemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<
    'all' | 'lost' | 'found' | 'resolved'
  >('all');

  const fetchMyReports = async () => {
    if (!user) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allReports = await ReportsService.getPublicReports();

      // Only show reports created by the authenticated user.
      const mine = allReports.filter(
        (report) => report.reporterId === user.id
      );

      setReports(mine);
    } catch (err) {
      console.error('Failed to load personal reports:', err);
      setError('Unable to load your reports. Please try again.');
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, [user]);

  const filteredReports = reports.filter((report) => {
    if (filter === 'lost') {
      return report.type === 'lost' && report.status !== 'resolved';
    }

    if (filter === 'found') {
      return report.type === 'found' && report.status !== 'resolved';
    }

    if (filter === 'resolved') {
      return report.status === 'resolved';
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            My Filings &amp; Reports
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View and track your personal lost and found submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Report Lost
            </Button>
          </Link>

          <Link to="/report-found">
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <PlusCircle className="w-4 h-4 text-emerald-600" />
              }
            >
              Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-navy-800 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          All Filings ({reports.length})
        </button>

        <button
          onClick={() => setFilter('lost')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'lost'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Active Lost (
          {reports.filter(
            (report) =>
              report.type === 'lost' && report.status !== 'resolved'
          ).length}
          )
        </button>

        <button
          onClick={() => setFilter('found')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'found'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Active Found (
          {reports.filter(
            (report) =>
              report.type === 'found' && report.status !== 'resolved'
          ).length}
          )
        </button>

        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'resolved'
              ? 'bg-slate-700 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Resolved (
          {reports.filter((report) => report.status === 'resolved').length}
          )
        </button>
      </div>

      {/* Reports Listing */}
      {isLoading ? (
        <LoadingSpinner
          label="Loading your personal reports..."
          className="py-16"
        />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-sm text-rose-600 mb-4">{error}</p>

          <Button variant="outline" size="sm" onClick={fetchMyReports}>
            Try Again
          </Button>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((item) => (
            <Card key={item.id} hoverEffect className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                      {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </Badge>

                    <Badge variant="neutral">
                      {formatCategory(item.category)}
                    </Badge>

                    <span className="text-xs text-slate-400 font-mono">
                      #{item.id}
                    </span>

                    {item.status === 'resolved' ? (
                      <Badge
                        variant="resolved"
                        className="bg-emerald-100 text-emerald-800"
                      >
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="found">Active Listing</Badge>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-navy-800">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-royal-500" />
                      {item.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Reported {formatDate(item.dateReported)}
                    </span>
                  </div>
                </div>

                {/* Report Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400">
                    Status updates coming soon
                  </span>

                  <Link to={`/item/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Public View
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No filings found in this tab"
          description="You do not have any lost or found reports under this filter. File a new report to begin tracking."
          actionLabel="File a Lost Report"
          onAction={() => window.location.assign('/report-lost')}
        />
      )}
    </div>
  );
};
