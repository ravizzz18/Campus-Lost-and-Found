import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { FlaggedReport } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ArrowRight, Eye, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const FlaggedReportsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [flags, setFlags] = useState<FlaggedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');

  const fetchFlags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ReportsService.getFlaggedQueue(isAdmin);
      setFlags(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to access moderation queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [isAdmin]);

  const filteredFlags = flags.filter((f) => {
    if (filter === 'pending') return f.status === 'pending';
    if (filter === 'reviewed') return f.status === 'reviewed' || f.status === 'action_taken';
    return true;
  });

  const pendingCount = flags.filter((f) => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-rose-700 tracking-wider">
              Administration &amp; Safety
            </span>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              Restricted Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            Flagged Content Moderation Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review listings flagged by campus members for guideline violations, false claims, or inappropriate text.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={pendingCount > 0 ? 'flagged' : 'neutral'} className="px-3 py-1 text-xs">
            {pendingCount} Case{pendingCount !== 1 ? 's' : ''} Pending
          </Badge>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'pending'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('reviewed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'reviewed'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Actioned / Cleared ({flags.filter((f) => f.status !== 'pending').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-navy-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          All Cases ({flags.length})
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner label="Fetching moderation queue..." className="py-20" />
      ) : error ? (
        <ErrorState
          title="Moderation Access Error"
          message={error}
          onRetry={fetchFlags}
        />
      ) : filteredFlags.length > 0 ? (
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <Card key={flag.id} hoverEffect className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                      FLAG #{flag.id}
                    </span>
                    <Badge variant="neutral">Report #{flag.reportId}</Badge>
                    {flag.status === 'pending' ? (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Pending Decision
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {flag.status === 'reviewed' ? 'Cleared (Active)' : 'Delisted'}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      • Flagged on {formatDate(flag.flaggedAt)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-navy-800">
                    {flag.itemTitle}
                  </h3>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-[11px]">
                      <span>Concern: {flag.flagReason.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      "{flag.flagDetails}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>
                      Flagged by member: <strong className="text-slate-600">{flag.reportedByUserName}</strong>
                    </span>
                    {flag.reviewerNotes && (
                      <span className="text-slate-500 italic">
                        Note: "{flag.reviewerNotes}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-2 flex-shrink-0">
                  <Link to={`/admin/review/${flag.reportId}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Inspect &amp; Moderate
                    </Button>
                  </Link>
                  <Link to={`/item/${flag.reportId}`}>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Public Listing
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          title="Moderation queue is clear"
          description="There are currently no flagged reports requiring administrative review in this category."
        />
      )}
    </div>
  );
};
