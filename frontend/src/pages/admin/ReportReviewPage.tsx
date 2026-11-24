import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { SAMPLE_REPORTS, SAMPLE_FLAGGED_REPORTS } from '@/services/mockData';
import { ItemReport, FlaggedReport } from '@/types';
import { formatDate, formatCategory } from '@/utils/formatters';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ReportReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [report, setReport] = useState<ItemReport | null>(null);
  const [flag, setFlag] = useState<FlaggedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    // Look for target report and flag
    const targetReport = SAMPLE_REPORTS.find((r) => r.id === id) || null;
    const targetFlag = SAMPLE_FLAGGED_REPORTS.find((f) => f.reportId === id) || SAMPLE_FLAGGED_REPORTS[0];

    setTimeout(() => {
      if (mounted) {
        setReport(targetReport);
        setFlag(targetFlag);
        setIsLoading(false);
      }
    }, 150);

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleExecuteDecision = async (action: 'approved' | 'removed') => {
    if (!flag) return;
    setIsActioning(true);

    try {
      await ReportsService.resolveFlag(flag.id, action, isAdmin, moderatorNotes);
      setDecisionFeedback(
        action === 'approved'
          ? `Listing #${id} was cleared and retained as active in the campus directory.`
          : `Listing #${id} was removed from the public campus directory.`
      );

      setTimeout(() => {
        navigate('/admin/flagged-reports');
      }, 1800);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to record administrative action.');
      setIsActioning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner label="Loading case files and moderation history..." />
      </div>
    );
  }

  if (!report || !flag) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Case Record Unavailable"
          message="Could not find the specified report or moderation flag details."
        />
        <div className="text-center mt-4">
          <Link to="/admin/flagged-reports">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Moderation Queue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/flagged-reports"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-navy-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Moderation Queue
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="flagged">Active Moderation Case</Badge>
          <span className="text-xs font-mono text-slate-400">Target Listing: #{report.id}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Review Listing: {report.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Inspect reported violation claims against campus regulations and record an enforceable moderation decision.
        </p>
      </div>

      {decisionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{decisionFeedback} Returning to queue...</span>
        </div>
      )}

      {/* Flag Complaint Context Box */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-2.5 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>REPORTED CONCERN: {flag.flagReason.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <span className="text-xs font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
            Case ID: #{flag.id}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-medium bg-white/70 p-3 rounded-lg border border-rose-200/80">
          "{flag.flagDetails}"
        </p>

        <div className="flex items-center gap-4 text-xs text-rose-700 pt-1">
          <span>Submitted by: <strong>{flag.reportedByUserName}</strong></span>
          <span>•</span>
          <span>Timestamp: {formatDate(flag.flaggedAt)}</span>
        </div>
      </div>

      {/* Item Listing Details under Inspection */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-navy-800">
              Original Submission Record
            </h2>
            <Badge variant={report.type === 'lost' ? 'lost' : 'found'}>
              {report.type === 'lost' ? 'Lost Item' : 'Found Item'}
            </Badge>
          </div>
          <Badge variant="neutral">{formatCategory(report.category)}</Badge>
        </div>

        <div>
          <h3 className="text-xl font-bold text-navy-800">{report.title}</h3>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70 whitespace-pre-line">
            {report.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-royal-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                Campus Location
              </span>
              <span className="font-semibold text-navy-800 text-sm">{report.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                Incident Date
              </span>
              <span className="font-semibold text-navy-800 text-sm">{formatDate(report.dateLostOrFound)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                Filed On
              </span>
              <span className="font-semibold text-navy-800 text-sm">{formatDate(report.dateReported)}</span>
            </div>
          </div>
        </div>

        {/* Reporter Authorized Directory Record */}
        <div className="pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Reporter Contact &amp; Registry Record (Admin Access Authorized)
            </h4>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span>Full Name: <strong>{report.reporterName}</strong></span>
              <span className="text-slate-400 font-mono text-[11px]">(ID: {report.reporterId})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Institutional Email: <strong>{report.contactEmail || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-royal-600" />
              <span>Contact Phone: <strong className="font-mono text-royal-700">{report.contactPhone || 'N/A'}</strong></span>
            </div>
          </div>
        </div>

        {/* Moderation Decision Form */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Moderation Audit Notes (Required for Decision Tracking)
            </label>
            <textarea
              rows={3}
              value={moderatorNotes}
              onChange={(e) => setModeratorNotes(e.target.value)}
              placeholder="Record justification for clearing or delisting this report..."
              className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link to="/admin/flagged-reports">
              <Button variant="outline" size="sm" disabled={isActioning}>
                Cancel
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleExecuteDecision('removed')}
                isLoading={isActioning}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Delist &amp; Remove Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecuteDecision('approved')}
                isLoading={isActioning}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Dismiss Flag &amp; Retain Listing
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
