import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_REPORTS } from '@/services/mockData';
import { formatDate } from '@/utils/formatters';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section — Minimal Editorial */}
      <section className="bg-navy-900 text-white relative overflow-hidden border-b border-navy-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-500/10 border border-royal-500/30 text-royal-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-royal-400 animate-pulse"></span>
              Centralized Campus Directory
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              A smarter way to reconnect people with their belongings.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              Campus Lost &amp; Found is the verified university portal for students, faculty, and staff. Report misplaced items, search active campus findings, and reclaim property safely.
            </p>

            {/* Quick Search Box */}
            <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword, item name, or campus building..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-navy-900 rounded-lg border-0 focus:ring-2 focus:ring-royal-500 text-sm shadow-subtle"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="sm:w-auto w-full">
                Search Directory
              </Button>
            </form>

            {/* Quick Action Badges */}
            <div className="mt-8 pt-6 border-t border-navy-800 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Direct Actions:
              </span>
              <Link to="/report-lost">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-navy-800/80 border-navy-700 text-amber-300 hover:bg-navy-700"
                  leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
                >
                  I Lost Something
                </Button>
              </Link>
              <Link to="/report-found">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-navy-800/80 border-navy-700 text-emerald-300 hover:bg-navy-700"
                  leftIcon={<PlusCircle className="w-4 h-4 text-emerald-400" />}
                >
                  I Found Something
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800">
            How Campus Lost &amp; Found Works
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            A verified, secure three-step process built specifically for campus environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden border-t-4 border-t-royal-500">
            <div className="w-10 h-10 rounded-lg bg-royal-50 text-royal-600 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-semibold text-navy-800">Report Promptly</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Post detailed reports for lost or found belongings including time, campus hall, category, and distinguishing characteristics.
            </p>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-amber-500">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-semibold text-navy-800">Browse &amp; Match</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Search by location, date, and category. Public listings keep sensitive contact details protected behind campus authentication.
            </p>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-emerald-500">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-semibold text-navy-800">Reconnect &amp; Resolve</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Verify ownership via direct campus phone/email contact. Reporters mark items resolved once returned to maintain an accurate directory.
            </p>
          </Card>
        </div>
      </section>

      {/* Recent Campus Reports Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy-800">Recent Campus Reports</h2>
            <p className="text-sm text-slate-500 mt-1">
              Active items reported across campus buildings in the past 48 hours.
            </p>
          </div>
          <Link to="/browse">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Reports
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_REPORTS.slice(0, 3).map((item) => (
            <Card key={item.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                    {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(item.dateReported)}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-navy-800 line-clamp-1">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-royal-500" />
                  {item.location}
                </span>
                <Link
                  to={`/item/${item.id}`}
                  className="font-medium text-royal-600 hover:text-royal-700 inline-flex items-center gap-1"
                >
                  Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Security & Verification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-royal-50 border border-royal-100 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-royal-500 text-white rounded-xl shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-800">
                Built for Campus Privacy &amp; Accountability
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                Personal contact details are never exposed to anonymous web scrapers. Sign in with your university credentials to verify ownership and arrange secure handoffs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/register">
              <Button variant="primary">Create Student Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
