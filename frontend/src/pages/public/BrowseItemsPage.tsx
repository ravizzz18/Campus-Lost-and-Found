import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ItemCard } from '@/components/common/ItemCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ReportsService } from '@/services/reportsService';
import { CATEGORY_OPTIONS, CAMPUS_LOCATIONS } from '@/utils/constants';
import { Search, RotateCcw, ArrowUpDown, Filter, X } from 'lucide-react';
import { ReportType, ItemCategory, ItemReport } from '@/types';

type SortOption = 'newest' | 'oldest' | 'title';

export const BrowseItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<ItemReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>(
    (searchParams.get('type') as ReportType) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>(
    (searchParams.get('category') as ItemCategory) || 'all'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ReportsService.getPublicReports();
      setItems(data);
    } catch (err) {
      setError('Failed to load campus reports. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReset = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter & Sort Pipeline
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [items, query, selectedType, selectedCategory, selectedLocation, sortBy]);

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedType !== 'all' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-royal-600">
            Public Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight mt-0.5">
            Browse Lost &amp; Found Items
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search active reports across all campus facilities. Contact details are protected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="lost" className="px-2.5 py-1">Lost Items</Badge>
          <Badge variant="found" className="px-2.5 py-1">Found Items</Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 sm:p-6 space-y-4 shadow-subtle">
        {/* Search input with reset button */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, brand, colors, or specific building locations..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-navy-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType | 'all')}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All (Lost &amp; Found)</option>
              <option value="lost">Lost Belongings</option>
              <option value="found">Found Items</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Campus Facility
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="all">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Sort By</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills and Reset Action */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              {selectedType !== 'all' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType('all')}>×</button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  Loc: {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')}>×</button>
                </span>
              )}
              {query && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  "{query}"
                  <button onClick={() => setQuery('')}>×</button>
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-navy-800"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing <strong className="text-navy-800 font-semibold">{filteredAndSortedItems.length}</strong> reports
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Public listings omit contact details for student privacy.
        </span>
      </div>

      {/* Main Listing State Handler */}
      {isLoading ? (
        <LoadingSpinner label="Fetching campus reports..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Filter className="w-6 h-6" />}
          title="No matching reports found"
          description="We couldn't find any reports matching your active filters. Try broadening your keyword or clearing the selected categories."
          actionLabel="Clear all filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};
