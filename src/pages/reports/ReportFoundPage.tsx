import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ItemCategory } from '@/types';

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('keys');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [holdingLocation, setHoldingLocation] = useState('With Reporter (Handover on Campus)');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // CLF-21 establishes the React UI structure. Full API persistence connects in CLF-22.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-subtle border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-navy-800">Found Item Report Logged</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for reporting <strong>"{title}"</strong>. The report is now indexed in the campus directory. You can mark this item resolved as soon as the verified owner retrieves it.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link to="/my-reports">
            <Button variant="primary">View My Reports</Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline">Browse Directory</Button>
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
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Found Belongings Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Report a Found Item
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Help return misplaced belongings to fellow students and campus staff members.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Item Name / Summary"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Set of 3 dorm keys with blue lanyard"
            required
            helperText="Keep the title concise and recognizable."
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
                Date Found
              </label>
              <input
                type="date"
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Found Location (Campus Building)
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Custody / Holding Spot
              </label>
              <select
                value={holdingLocation}
                onChange={(e) => setHoldingLocation(e.target.value)}
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              >
                <option value="With Reporter (Handover on Campus)">With Reporter (Handover on Campus)</option>
                <option value="Central Library Helpdesk">Central Library Helpdesk</option>
                <option value="Campus Security Office (Admin 102)">Campus Security Office (Admin 102)</option>
                <option value="Student Center Information Desk">Student Center Information Desk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Public Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where it was picked up and how the owner can prove ownership (e.g. tell them to specify lock screen wallpaper or serial number)..."
              required
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
          </div>

          <Input
            label="Your Contact Phone (Protected)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            helperText="Concealed from public visitors. Visible only to authenticated campus users."
          />

          <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-start gap-3 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Owner Verification Tip:</strong> Keep one secret detail unlisted (e.g., wallet contents or laptop sticker) so the claimant can verify true ownership.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Found Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
