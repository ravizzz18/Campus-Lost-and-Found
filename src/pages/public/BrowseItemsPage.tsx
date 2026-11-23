import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_REPORTS } from '@/services/mockData';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { formatCategory } from '@/utils/formatters';
import { Search, Filter, MapPin, ArrowRight, RotateCcw } from 'lucide-react';
import { ReportType, ItemCategory } from '@/types';

export const BrowseItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>(
    (searchParams.get('type') as ReportType) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>(
    (searchParams.get('category') as ItemCategory) || 'all'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return SAMPLE_REPORTS.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    });
  }, [query, selectedType, selectedCategory, selectedLocation]);

  const handleReset = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800">Browse Lost &amp; Found Directory</h1>
        <p className="mt-1 text-sm text-slate-500">
          Filter through reports from all campus buildings and residential areas.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, model, serial, or description..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType | 'all')}
              className="w-full py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All (Lost &amp; Found)</option>
              <option value="lost">Lost Items Only</option>
              <option value="found">Found Items Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')}
              className="w-full py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Campus Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing <strong className="text-navy-800">{filteredItems.length}</strong> active reports
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="lost">Lost</Badge>
          <Badge variant="found">Found</Badge>
          <Badge variant="resolved">Resolved</Badge>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.type === 'lost' ? 'lost' : 'found'}>
                      {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                  </div>
                  {item.status === 'resolved' && <Badge variant="resolved">Resolved</Badge>}
                </div>

                <h3 className="text-base font-semibold text-navy-800 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-royal-600 font-medium mt-1">
                  {formatCategory(item.category)}
                </p>
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
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 px-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-navy-800">No matching reports found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Categories", or checking other campus locations.
          </p>
          <Button variant="outline" size="sm" onClick={handleReset} className="mt-4">
            Clear all filters
          </Button>
        </Card>
      )}
    </div>
  );
};
