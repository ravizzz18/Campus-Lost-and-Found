import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ItemCategory } from '@/types';

export const ReportLostPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
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
        <h1 className="text-2xl font-bold text-navy-800">Lost Item Report Registered</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your report for <strong>"{title}"</strong> has been queued in the campus lost directory. You will be notified if a matching found item or inquiry is submitted.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link to="/my-reports">
            <Button variant="primary">Go to My Reports</Button>
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
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Lost Belongings Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Report a Lost Item
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate details to assist campus peers and security in identifying your item.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Item Name / Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Silver 13-inch MacBook Air with blue sticker"
            required
            helperText="Include brand, model, color, or defining physical cues."
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
                Estimated Date Lost
              </label>
              <input
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
                required
                className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
              />
            </div>
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details: serial number snippets, engravings, contents, scratches, or specific study cubicle location..."
              required
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-navy-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            ></textarea>
          </div>

          <Input
            label="Recovery Contact Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            helperText="Only verified, logged-in students and staff can view your contact information."
          />

          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Protocol:</strong> Your phone number and email are concealed from public anonymous visitors. Only authenticated campus account holders can request contact for verification.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Lost Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
