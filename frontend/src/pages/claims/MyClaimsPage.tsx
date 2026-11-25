
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  RefreshCw,
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { ClaimsService, Claim } from '@/services/claimsService';
import { ReportsService } from '@/services/reportsService';
import { ItemReport } from '@/types';
import { formatDate } from '@/utils/formatters';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const MyClaimsPage: React.FC = () => {
  const { user } = useAuth();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [items, setItems] = useState<Record<string, ItemReport>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClaims = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ClaimsService.getClaims();

      const ownClaims = data.filter(
        (claim) => String(claim.user_id) === user?.id
      );

      setClaims(ownClaims);

      const itemResults = await Promise.all(
        [...new Set(ownClaims.map((claim) => claim.item_id))].map(
          async (itemId) => {
            try {
              const item = await ReportsService.getPublicReportById(
                String(itemId)
              );
              return item ? [String(itemId), item] as const : null;
            } catch {
              return null;
            }
          }
        )
      );

      const itemMap: Record<string, ItemReport> = {};

      itemResults.forEach((result) => {
        if (result) {
          itemMap[result[0]] = result[1];
        }
      });

      setItems(itemMap);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your claims.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadClaims();
  }, [user?.id]);

  const pendingCount = claims.filter(
    (claim) => claim.claim_status === 'pending'
  ).length;

  const approvedCount = claims.filter(
    (claim) => claim.claim_status === 'approved'
  ).length;

  const rejectedCount = claims.filter(
    (claim) => claim.claim_status === 'rejected'
  ).length;

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading your claims..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-slate-500 hover:text-navy-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">
              My Claims
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track ownership claims submitted for found belongings.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadClaims()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-navy-800">
                {pendingCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500">Approved</p>
              <p className="text-2xl font-bold text-navy-800">
                {approvedCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="text-2xl font-bold text-navy-800">
                {rejectedCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <Card className="p-5 border-rose-200 bg-rose-50">
          <p className="text-sm text-rose-700">{error}</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => void loadClaims()}
          >
            Try Again
          </Button>
        </Card>
      )}

      {!error && claims.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy-800">
            No Claims Yet
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Submit an ownership claim for a found item and track its progress here.
          </p>
          <Link to="/browse" className="inline-block mt-5">
            <Button variant="primary" size="sm">
              Browse Found Items
            </Button>
          </Link>
        </Card>
      ) : (
        !error && (
          <div className="space-y-4">
            {claims.map((claim) => {
              const item = items[String(claim.item_id)];

              return (
                <Card key={claim.claim_id} className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          Claim #{claim.claim_id}
                        </span>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[claim.claim_status]}`}
                        >
                          {claim.claim_status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-navy-800">
                        {item?.title || `Found Item #${claim.item_id}`}
                      </h3>

                      <p className="text-sm text-slate-600 whitespace-pre-line">
                        {claim.claim_details}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Submitted {formatDate(claim.claim_date)}
                      </div>
                    </div>

                    {item && (
                      <Link to={`/item/${claim.item_id}`}>
                        <Button variant="outline" size="sm">
                          View Item
                        </Button>
                      </Link>
                    )}
                  </div>

                  {claim.admin_review && (
                    <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Administrator's Feedback
                      </p>
                      <p className="text-sm text-slate-600">
                        {claim.admin_review}
                      </p>
                    </div>
                  )}

                  {claim.claim_status === 'approved' && (
                    <p className="mt-3 text-xs text-emerald-700">
                      Your ownership claim has been approved. Please coordinate the item handover with the reporter.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
