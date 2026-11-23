import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_FLAGGED_REPORTS } from '@/services/mockData';
import { formatDate } from '@/utils/formatters';
import { ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { FlaggedReport } from '@/types';

export const FlaggedReportsPage: React.FC = () => {
  const [flags] = useState<FlaggedReport[]>(SAMPLE_FLAGGED_REPORTS);
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');

  const filteredFlags = flags.filter((f) => {
    if (filter === 'pending') return f.status === 'pending';
    if (filter === 'reviewed') return f.status === 'reviewed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            Flagged Content Moderation Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review user-reported listings violating campus policies or containing inaccurate information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="flagged" className="px-3 py-1 text-xs">
            {flags.filter((f) => f.status === 'pending').length} Pending Review
          </Badge>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'pending'
              ? 'bg-rose-600 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Pending Review ({flags.filter((f) => f.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-navy-800 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          All Flags ({flags.length})
        </button>
      </div>

      {/* Flagged Items Queue */}
      <div className="space-y-4">
        {filteredFlags.length > 0 ? (
          filteredFlags.map((flag) => (
            <Card key={flag.id} hoverEffect className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      FLAG #{flag.id}
                    </span>
                    <Badge variant="neutral">Target: Report #{flag.reportId}</Badge>
                    <span className="text-xs text-slate-400">
                      Flagged on {formatDate(flag.flaggedAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-800">{flag.itemTitle}</h3>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                    <span className="font-semibold text-rose-700 uppercase tracking-wide mr-2">
                      Reason: {flag.flagReason.replace(/_/g, ' ')}
                    </span>
                    <p className="mt-1 text-slate-600">{flag.flagDetails}</p>
                  </div>

                  <p className="text-xs text-slate-400">
                    Reported by: <span className="text-slate-600 font-medium">{flag.reportedByUserName}</span>
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-2 flex-shrink-0">
                  <Link to={`/admin/review/${flag.reportId}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Inspect &amp; Moderate
                    </Button>
                  </Link>
                  <Link to={`/item/${flag.reportId}`}>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      View Public Listing
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-16 px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-navy-800">Queue is Clear</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No pending reports currently flagged for inappropriate content or violations.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
