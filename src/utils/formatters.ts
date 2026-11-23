import { ItemCategory, ItemStatus, ReportType } from '@/types';
import { CATEGORY_OPTIONS } from './constants';

export function formatCategory(category: ItemCategory): string {
  const match = CATEGORY_OPTIONS.find((c) => c.value === category);
  return match ? match.label : category;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status: ItemStatus) {
  switch (status) {
    case 'open':
      return { text: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'claimed':
      return { text: 'Claim In Progress', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'resolved':
      return { text: 'Resolved', className: 'bg-slate-100 text-slate-600 border-slate-200' };
    case 'closed':
      return { text: 'Closed', className: 'bg-slate-100 text-slate-500 border-slate-200' };
    default:
      return { text: status, className: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
}

export function getTypeBadge(type: ReportType) {
  if (type === 'lost') {
    return { text: 'Lost Item', className: 'badge-lost' };
  }
  return { text: 'Found Item', className: 'badge-found' };
}
