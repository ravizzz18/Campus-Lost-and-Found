import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ItemCard } from '@/components/common/ItemCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReportsService } from '@/services/reportsService';
import { ItemReport } from '@/types';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReports, setRecentReports] = useState<ItemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    ReportsService.getPublicReports()
      .then((items) => {
        if (mounted) {
          setRecentReports(items.slice(0, 3));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

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
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royal-500/10 border border-royal-500/30 text-royal-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-royal-400" />
              <span>Campus Lost &amp; Found Directory</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              A smarter way to reconnect people with their belongings.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              The verified university network for students, faculty, and campus staff. Report misplaced property, search active campus findings, and reclaim items safely.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword, item model, or campus building..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-navy-900 rounded-lg border-0 focus:ring-2 focus:ring-royal-500 text-sm shadow-subtle"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="sm:w-auto w-full">
                Search Directory
              </Button>
            </form>

            {/* Direct Action Entry Points */}
            <div className="mt-8 pt-6 border-t border-navy-800 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Direct Actions:
              </span>
              <Link to="/report-lost">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-navy-800/90 border-navy-700 text-amber-300 hover:bg-navy-700"
                  leftIcon={<PlusCircle className="w-4 h-4 text-amber-400" />}
                >
                  I Lost Something
                </Button>
              </Link>
              <Link to="/report-found">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-navy-800/90 border-navy-700 text-emerald-300 hover:bg-navy-700"
                  leftIcon={<PlusCircle className="w-4 h-4 text-emerald-400" />}
                >
                  I Found Something
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Browse All Items →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="bg-navy-950/80 border-t border-navy-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Campus Protected</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">12+</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Campus Buildings</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">85%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Recovery Rate</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">0 Public Exposure</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Privacy Shield</div>
            </div>
          </div>
        </div>
      </section>

      {/* How Campus Lost & Found Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800">
            How Campus Lost &amp; Found Works
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            A verified, secure three-step process built specifically for students and staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden border-t-4 border-t-royal-500 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-lg bg-royal-50 text-royal-600 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-navy-800">Report Promptly</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Post detailed reports for lost or found belongings including time, campus hall, category, and distinguishing characteristics.
            </p>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-amber-500 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-navy-800">Browse &amp; Match</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Search by building, date, and category. Public listings keep sensitive contact details protected behind campus authentication.
            </p>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-emerald-500 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-navy-800">Reconnect &amp; Resolve</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Verify ownership via direct campus phone contact. Only the original reporter marks items resolved once returned to keep directory clear.
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

        {isLoading ? (
          <LoadingSpinner label="Loading recent reports..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Safety & Institutional Verification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-royal-50 border border-royal-100 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-royal-500 text-white rounded-xl shadow-sm flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-800">
                Built for Campus Privacy &amp; Accountability
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                Personal contact details are never exposed to anonymous visitors. Sign in with your campus account to verify ownership and arrange safe handoffs in public locations.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">Create Account</Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
