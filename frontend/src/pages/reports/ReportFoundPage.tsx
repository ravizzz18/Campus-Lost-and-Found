import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { CheckCircle2, ArrowLeft, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { ItemCategory, ItemReport } from '@/types';

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('keys');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [timeFound, setTimeFound] = useState('14:30');
  const [holdingLocation, setHoldingLocation] = useState('With Reporter (Handover on Campus)');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<ItemReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || title.trim().length < 3) {
      setError('Item title must be at least 3 characters long.');
      return;
    }

    if (title.length > 100) {
      setError('Item title cannot exceed 100 characters.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide a descriptive explanation (minimum 15 characters) of where you found it.');
      return;
    }

    if (!user) {
      setError('You must be signed in to submit a report.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDate = `${dateFound}T${timeFound}:00Z`;
      const combinedDesc = `${description.trim()}\n\nCurrent Custody: ${holdingLocation}`;

      const created = await ReportsService.createReport({
        title: title.trim(),
        category,
        description: combinedDesc,
        type: 'found',
        location,
        dateLostOrFound: fullDate,
        reporterId: user.id,
        reporterName: user.name,
        contactPhone: user.phone || '+1 (555) 019-4567',
        contactEmail: user.email,
        images: image ? [image] : undefined,
        isFlagged: false,
      });

      setSubmittedReport(created);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish found item report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-subtle border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800">
          Found Item Report Published
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for reporting <strong>"{submittedReport.title}"</strong>. It is now published in the public campus directory under <strong>#{submittedReport.id}</strong>. When the verified owner contacts you and retrieves it, you can mark it as resolved in My Reports.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link to={`/item/${submittedReport.id}`}>
            <Button variant="primary">View Public Listing</Button>
          </Link>
          <Link to="/my-reports">
            <Button variant="outline">Go to My Reports</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-navy-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Dashboard
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Found Belongings Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Report a Found Item
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Help return misplaced belongings to fellow campus peers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Item Name / Summary"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Set of 3 dorm keys with blue university lanyard"
            maxLength={100}
            required
            helperText="Keep the title concise and recognizable (3-100 characters)."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Campus Location (Where Found)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Date Found
              </label>
              <input
                type="date"
                value={dateFound}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDateFound(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Approximate Time
              </label>
              <input
                type="time"
                value={timeFound}
                onChange={(e) => setTimeFound(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Current Custody / Item Location
            </label>
            <select
              value={holdingLocation}
              onChange={(e) => setHoldingLocation(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="With Reporter (Handover on Campus)">With Reporter (Handover in public campus spot)</option>
              <option value="Central Library Helpdesk">Central Library Helpdesk</option>
              <option value="Campus Security Office (Admin Block 102)">Campus Security Office (Admin Block 102)</option>
              <option value="Student Center Information Desk">Student Center Information Desk</option>
              <option value="Science & Tech Building Department Office">Science &amp; Tech Building Department Office</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Public Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where it was picked up and how the owner can prove ownership (e.g. tell claimant to describe lock screen wallpaper or keychain tag)..."
              required
              maxLength={1000}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
            <span className="text-[11px] text-slate-400 float-right mt-1">
              {description.length}/1000 characters
            </span>
          </div>

          <ImageUpload
            label="Item Photograph (Optional)"
            helperText="A clear photograph of the found item aids immediate identification."
            onImageChange={setImage}
          />

          <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Owner Verification Best Practice</span>
            </div>
            <p className="leading-relaxed">
              Keep one distinctive feature unmentioned (e.g. precise keychain charms, phone case engraving, or exact wallet currency) so that claimants can prove true ownership before handover.
            </p>
            <div className="flex items-center gap-1.5 text-slate-600 pt-1 border-t border-emerald-200/60">
              <Lock className="w-3.5 h-3.5 text-royal-500" />
              <span>
                Your phone number is concealed from anonymous web users and only revealed to authenticated students and staff.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Publish Found Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
