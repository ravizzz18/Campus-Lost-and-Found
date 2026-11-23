import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { ItemReport, FlaggedReport } from '@/types';
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
  Info,
  Clock,
} from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [item, setItem] = useState<ItemReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Protected Contact Reveal State
  const [revealedContact, setRevealedContact] = useState<{
    phone: string;
    email: string;
    reporterName: string;
  } | null>(null);
  const [isRevealingContact, setIsRevealingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  // Flag Modal State
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState<FlaggedReport['flagReason']>('incorrect_information');
  const [flagDetails, setFlagDetails] = useState('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagFeedback, setFlagFeedback] = useState<string | null>(null);

  // Load public report
  useEffect(() => {
    let mounted = true;
    if (!id) return;

    setIsLoading(true);
    ReportsService.getPublicReportById(id)
      .then((data) => {
        if (!mounted) return;
        if (data) {
          setItem(data);
        } else {
          setError('The requested report does not exist or has been removed from the directory.');
        }
      })
      .catch(() => {
        if (mounted) setError('Failed to load report details.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // Handle protected contact revelation
  const handleRevealContact = async () => {
    if (!item) return;
    setIsRevealingContact(true);
    setContactError(null);
    try {
      const contact = await ReportsService.getReporterContact(item.id, isAuthenticated);
      setRevealedContact(contact);
    } catch (err: unknown) {
      setContactError(
        err instanceof Error ? err.message : 'Unable to retrieve authenticated contact details.'
      );
    } finally {
      setIsRevealingContact(false);
    }
  };

  // Handle flag submission
  const handleSubmitFlag = async () => {
    if (!item || !user) return;
    setIsSubmittingFlag(true);
    try {
      await ReportsService.submitFlag(
        item.id,
        flagReason,
        flagDetails,
        user.id,
        user.name
      );
      setShowFlagModal(false);
      setFlagFeedback('Your flag report has been submitted to campus moderators for review.');
    } catch {
      alert('Failed to submit flag. Please try again.');
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner label="Loading item details..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Listing Not Available"
          message={error || 'Could not find the requested item.'}
        />
        <div className="text-center mt-4">
          <Link to="/browse">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';

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

      {flagFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{flagFeedback}</span>
          </div>
          <button onClick={() => setFlagFeedback(null)} className="text-emerald-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Item Card */}
      <Card className="overflow-hidden shadow-card">
        {/* Card Header with Badges & Status */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={isLost ? 'lost' : 'found'} className="text-sm px-3 py-1">
              {isLost ? 'Lost Item' : 'Found Item'}
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

            {/* Flag Trigger */}
            {isAuthenticated ? (
              <button
                onClick={() => setShowFlagModal(true)}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 p-1 ml-2"
                title="Flag inappropriate or inaccurate report"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Flag Listing</span>
              </button>
            ) : (
              <Link
                to={`/login?redirect=/item/${item.id}`}
                className="text-xs text-slate-400 hover:text-navy-800 inline-flex items-center gap-1 p-1 ml-2"
                title="Sign in to flag"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Flag (Login required)</span>
              </Link>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Images Section if Available */}
          {item.images && item.images.length > 0 && (
            <div className="mb-6 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight leading-tight">
              {item.title}
            </h1>
            <p className="mt-4 text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-royal-50 text-royal-600 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Campus Location
                </span>
                <span className="font-semibold text-navy-800">{item.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  {isLost ? 'Date Last Seen' : 'Date Found'}
                </span>
                <span className="font-semibold text-navy-800">{formatDate(item.dateLostOrFound)}</span>
              </div>
            </div>
          </div>

          {/* Publication Context */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Official report registered on {formatDate(item.dateReported)}</span>
            <span>•</span>
            <span>Filed by {item.reporterName}</span>
          </div>

          {/* PROTECTED CONTACT SECTION */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-royal-500" />
                <span>Reporter Contact Information</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Verified Campus Phone Channel
              </span>
            </div>

            {isAuthenticated ? (
              revealedContact ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-sm text-navy-800">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{revealedContact.reporterName}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Authenticated Member
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-200 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-royal-600" />
                      <a
                        href={`tel:${revealedContact.phone}`}
                        className="font-mono font-semibold text-royal-600 hover:underline"
                      >
                        {revealedContact.phone}
                      </a>
                    </div>
                    {revealedContact.email && (
                      <div className="flex items-center gap-2 sm:border-l sm:border-slate-200 sm:pl-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a
                          href={`mailto:${revealedContact.email}`}
                          className="text-slate-600 hover:text-royal-600 hover:underline"
                        >
                          {revealedContact.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 flex items-start gap-2">
                    <Info className="w-4 h-4 text-royal-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Please arrange handoffs only in well-lit public campus buildings (such as Central Library helpdesk or the Campus Security office).
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-navy-800">
                      Reporter Phone Number Protected
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You are signed in as a verified campus member. Reveal the phone number to coordinate handoff.
                    </p>
                    {contactError && (
                      <p className="text-xs text-rose-600 mt-1 font-medium">{contactError}</p>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRevealContact}
                    isLoading={isRevealingContact}
                    leftIcon={<Phone className="w-4 h-4" />}
                  >
                    Reveal Contact Phone
                  </Button>
                </div>
              )
            ) : (
              <div className="bg-royal-50/70 border border-royal-100 rounded-xl p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-royal-100 text-royal-600 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-navy-800">
                  Campus Member Verification Required
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Under campus safety rules, reporter contact numbers are never exposed publicly. Please sign in with your campus account to view contact details.
                </p>
                <div className="pt-1">
                  <Link to={`/login?redirect=/item/${item.id}`}>
                    <Button variant="primary" size="sm">
                      Sign in with Campus ID
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Campus Lost &amp; Found Verified Listing
          </span>

          <div className="flex items-center gap-3">
            <Link to="/browse">
              <Button variant="outline" size="sm">
                Browse More Items
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Flag Report Dialog */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-elevated">
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-navy-800">Flag Report #{item.id}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Moderators will review this report against university guidelines.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Reason for Flagging
                </label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value as FlaggedReport['flagReason'])}
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="incorrect_information">Incorrect or misleading information</option>
                  <option value="inappropriate_content">Inappropriate or offensive content</option>
                  <option value="spam">Duplicate or spam report</option>
                  <option value="fraud">Potential fraudulent claim</option>
                  <option value="other">Other campus guideline concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Details / Explanation
                </label>
                <textarea
                  rows={3}
                  value={flagDetails}
                  onChange={(e) => setFlagDetails(e.target.value)}
                  placeholder="Provide context for the moderation team..."
                  required
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 placeholder-slate-400"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFlagModal(false)}
                disabled={isSubmittingFlag}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleSubmitFlag}
                isLoading={isSubmittingFlag}
                disabled={!flagDetails.trim()}
              >
                Submit Flag
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
