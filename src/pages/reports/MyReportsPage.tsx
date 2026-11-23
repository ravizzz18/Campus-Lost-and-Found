import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_REPORTS } from '@/services/mockData';
import { formatDate, formatCategory } from '@/utils/formatters';
import {
  FileText,
  PlusCircle,
  CheckCircle,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { ItemReport, ItemStatus } from '@/types';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ItemReport[]>(SAMPLE_REPORTS.slice(0, 3));
  const [filter, setFilter] = useState<'all' | 'lost' | 'found' | 'resolved'>('all');

  const handleToggleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus: ItemStatus = r.status === 'resolved' ? 'open' : 'resolved';
          return {
            ...r,
            status: nextStatus,
            resolvedAt: nextStatus === 'resolved' ? new Date().toISOString() : undefined,
          };
        }
        return r;
      })
    );
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'lost') return r.type === 'lost' && r.status !== 'resolved';
    if (filter === 'found') return r.type === 'found' && r.status !== 'resolved';
    if (filter === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            My Filings &amp; Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your reported lost and found items. Mark items as resolved once reconnected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/report-lost">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Report Lost
            </Button>
          </Link>
          <Link to="/report-found">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
            >
              Report Found
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-navy-800 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          All Filings ({reports.length})
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'lost'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Active Lost
        </button>
        <button
          onClick={() => setFilter('found')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'found'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Active Found
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'resolved'
              ? 'bg-slate-700 text-white'
              : 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((item) => (
            <Card key={item.id} hoverEffect className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                      {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </Badge>
                    <Badge variant="neutral">{formatCategory(item.category)}</Badge>
                    <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                    {item.status === 'resolved' ? (
                      <Badge variant="resolved" className="bg-emerald-100 text-emerald-800">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="found">Active Listing</Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-navy-800">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-royal-500" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Reported {formatDate(item.dateReported)}
                    </span>
                  </div>
                </div>

                {/* Reporter Controls */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-2 flex-shrink-0">
                  <Button
                    variant={item.status === 'resolved' ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={() => handleToggleResolve(item.id)}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                  >
                    {item.status === 'resolved' ? 'Reopen Listing' : 'Mark as Resolved'}
                  </Button>

                  <Link to={`/item/${item.id}`}>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Public Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-16 px-4">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-navy-800">No reports found in this tab</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't filed any reports matching this filter yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
