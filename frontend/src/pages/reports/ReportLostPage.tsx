import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/common/ImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { ReportsService } from '@/services/reportsService';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { AlertCircle, ArrowLeft, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { ItemCategory, ItemReport } from '@/types';

export const ReportLostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [timeLost, setTimeLost] = useState('12:00');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<ItemReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim() || title.trim().length < 3) {
      setError('Item title must be at least 3 characters long.');
      return;
    }

    if (title.length > 100) {
      setError('Item title cannot exceed 100 characters.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide a descriptive explanation (minimum 15 characters) to assist identification.');
      return;
    }

    if (!user) {
      setError('You must be signed in to submit a report.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDate = `${dateLost}T${timeLost}:00Z`;
      const created = await ReportsService.createReport({
        title: title.trim(),
        category,
        description: description.trim(),
        type: 'lost',
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
      setError(err instanceof Error ? err.message : 'Failed to publish lost item report.');
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
          Lost Item Report Published
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your report for <strong>"{submittedReport.title}"</strong> has been indexed in the public directory under <strong>#{submittedReport.id}</strong>. Your contact phone is protected behind campus authentication.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link to={`/item/${submittedReport.id}`}>
            <Button variant="primary">View Published Listing</Button>
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
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Lost Belongings Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Report a Lost Item
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate details to assist campus peers and security staff in locating your belongings.
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
            label="Item Name / Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Silver 14-inch MacBook Pro with astronaut sticker"
            maxLength={100}
            required
            helperText="Include brand, model, color, or defining physical cues (3-100 characters)."
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
                Campus Location Where Last Seen
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
                Date When Lost
              </label>
              <input
                type="date"
                value={dateLost}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDateLost(e.target.value)}
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
                value={timeLost}
                onChange={(e) => setTimeLost(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Detailed Description &amp; Identifying Characteristics
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details: serial number snippets, engravings, contents, scratches, or specific study cubicle location..."
              required
              maxLength={1000}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
            <span className="text-[11px] text-slate-400 float-right mt-1">
              {description.length}/1000 characters
            </span>
          </div>

          <ImageUpload
            label="Upload Item Photograph (Optional)"
            helperText="An image of the item or identical model helps peers identify it quickly."
            onImageChange={setImage}
          />

          {/* Reporter Institutional Info Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-navy-800 uppercase tracking-wider">
                Reporter Identity &amp; Contact Channel
              </span>
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Account
              </span>
            </div>
            <p className="text-slate-600">
              Submitted as: <strong>{user?.name}</strong> ({user?.email})
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 pt-1">
              <Lock className="w-3.5 h-3.5 text-royal-500" />
              <span>
                Your phone number (<strong>{user?.phone || 'Configured in Profile'}</strong>) will only be accessible to authenticated students and staff.
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
              Publish Lost Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
