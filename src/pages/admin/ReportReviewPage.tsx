import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_REPORTS, SAMPLE_FLAGGED_REPORTS } from '@/services/mockData';
import { formatDate, formatCategory } from '@/utils/formatters';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export const ReportReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

  const report = SAMPLE_REPORTS.find((r) => r.id === id) || SAMPLE_REPORTS[0];
  const flag = SAMPLE_FLAGGED_REPORTS.find((f) => f.reportId === report.id) || SAMPLE_FLAGGED_REPORTS[0];

  const handleAction = (action: 'approved' | 'removed') => {
    setResolutionStatus(action);
    setTimeout(() => {
      navigate('/admin/flagged-reports');
    }, 1500);
  };

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
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="flagged">Active Flag Review</Badge>
          <span className="text-xs font-mono text-slate-400">Target Item ID: #{report.id}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Moderation Case Review: {report.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review reported violation details against campus guidelines and execute an administrative decision.
        </p>
      </div>

      {resolutionStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            Decision recorded: Report #{report.id} was marked as <strong>{resolutionStatus}</strong>. Redirecting...
          </span>
        </div>
      )}

      {/* Flag reason alert box */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Flag Reason: {flag.flagReason.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed">
          <strong>Flag Description from Reporter ({flag.reportedByUserName}):</strong> "{flag.flagDetails}"
        </p>
        <div className="text-[11px] text-rose-500 pt-1">
          Submitted on {formatDate(flag.flaggedAt)}
        </div>
      </div>

      {/* Item Details under review */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-navy-800">Original Listing Information</h2>
          <Badge variant={report.type === 'lost' ? 'lost' : 'found'}>
            {report.type === 'lost' ? 'Lost Item Report' : 'Found Item Report'}
          </Badge>
        </div>

        <div>
          <h3 className="text-xl font-bold text-navy-800">{report.title}</h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {report.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">
              Category
            </span>
            <span className="font-medium text-navy-800 text-sm">{formatCategory(report.category)}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">
              Campus Location
            </span>
            <span className="font-medium text-navy-800 text-sm">{report.location}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">
              Filing Date
            </span>
            <span className="font-medium text-navy-800 text-sm">{formatDate(report.dateReported)}</span>
          </div>
        </div>

        {/* Reporter Institutional Info */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Reporter Institutional Record
          </h4>
          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700">
            <div>
              <strong>Name:</strong> {report.reporterName}
            </div>
            <div>
              <strong>Email:</strong> {report.contactEmail || 'N/A'}
            </div>
            <div>
              <strong>Phone:</strong> {report.contactPhone || 'N/A'}
            </div>
          </div>
        </div>

        {/* Moderation Controls */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Moderator Audit Notes
            </label>
            <textarea
              rows={3}
              value={moderatorNotes}
              onChange={(e) => setModeratorNotes(e.target.value)}
              placeholder="Record justification for clearing or taking action on this report..."
              className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link to="/admin/flagged-reports">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction('removed')}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Remove / Delist Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAction('approved')}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Dismiss Flag &amp; Keep Active
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
