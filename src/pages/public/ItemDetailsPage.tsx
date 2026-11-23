import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { SAMPLE_REPORTS } from '@/services/mockData';
import { formatCategory, formatDate } from '@/utils/formatters';
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const item = SAMPLE_REPORTS.find((r) => r.id === id) || SAMPLE_REPORTS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Directory
        </Link>
      </div>

      {/* Main Item Card */}
      <Card className="overflow-hidden">
        {/* Card Header with Badges & Status */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={item.type === 'lost' ? 'lost' : 'found'} className="text-sm px-3 py-1">
              {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
            </Badge>
            <Badge variant="neutral">{formatCategory(item.category)}</Badge>
            <span className="text-xs text-slate-400 font-mono">Report ID: #{item.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {item.status === 'resolved' ? (
              <Badge variant="resolved" className="text-xs px-2.5 py-1">
                Resolved &amp; Returned
              </Badge>
            ) : (
              <Badge variant="found" className="text-xs px-2.5 py-1">
                Active Listing
              </Badge>
            )}
            <button
              onClick={() => setShowFlagModal(true)}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 p-1"
              title="Flag inappropriate report"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flag</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
              {item.title}
            </h1>
            <p className="mt-4 text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-royal-50 text-royal-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Campus Location
                </span>
                <span className="font-medium text-navy-800">{item.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Date Lost/Found
                </span>
                <span className="font-medium text-navy-800">{formatDate(item.dateLostOrFound)}</span>
              </div>
            </div>
          </div>

          {/* Contact & Verification Box (Protected Information) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-3">
              Reporter &amp; Contact Information
            </h3>

            {isAuthenticated ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{item.reporterName}</span>
                  <span className="text-xs text-slate-400">(Verified Campus Member)</span>
                </div>
                {item.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="font-mono text-royal-600 hover:underline"
                    >
                      {item.contactPhone}
                    </a>
                  </div>
                )}
                {item.contactEmail && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a
                      href={`mailto:${item.contactEmail}`}
                      className="text-royal-600 hover:underline"
                    >
                      {item.contactEmail}
                    </a>
                  </div>
                )}
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  Always arrange handoffs in public campus locations (e.g. Student Center desk or Campus Security office).
                </div>
              </div>
            ) : (
              <div className="bg-royal-50/70 border border-royal-100 rounded-xl p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-royal-100 text-royal-600 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-navy-800">
                  Contact Information Protected
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  In compliance with university safety policies, phone numbers and direct email addresses are restricted to authenticated students and staff.
                </p>
                <div className="pt-1">
                  <Link to={`/login?redirect=/item/${item.id}`}>
                    <Button variant="primary" size="sm">
                      Sign in to View Contact Info
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-6 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Reported on {formatDate(item.dateReported)}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Claim verification workflow will be activated in milestone CLF-22.')}
            >
              Verify Ownership
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Contact messaging flow will be activated in milestone CLF-22.')}
            >
              Contact Reporter
            </Button>
          </div>
        </div>
      </Card>

      {/* Flag Report Modal / Placeholder */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-navy-800">Flag Report for Review</h3>
            </div>
            <p className="text-xs text-slate-500">
              Submit a concern to campus moderators regarding Report #{item.id}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Reason for Flagging
                </label>
                <select className="w-full text-sm p-2 rounded-lg border border-slate-200">
                  <option>Inappropriate or offensive content</option>
                  <option>Incorrect or misleading information</option>
                  <option>Duplicate or spam report</option>
                  <option>Potential fraudulent claim</option>
                  <option>Other policy violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 placeholder-slate-400"
                  placeholder="Explain why this listing should be reviewed..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFlagModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setFlagSubmitted(true);
                  setShowFlagModal(false);
                }}
              >
                Submit Flag
              </Button>
            </div>
          </Card>
        </div>
      )}

      {flagSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Flag received. Campus moderators have been notified to inspect Report #{item.id}.</span>
        </div>
      )}
    </div>
  );
};
