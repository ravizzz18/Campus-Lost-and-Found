/**
 * Campus Lost & Found (CLF) Core TypeScript Interfaces & Types
 */

export type ReportType = 'lost' | 'found';

export type ItemStatus = 'open' | 'claimed' | 'resolved' | 'closed';

export type ItemCategory =
  | 'electronics'
  | 'id_cards'
  | 'keys'
  | 'wallets'
  | 'bags'
  | 'clothing'
  | 'books'
  | 'accessories'
  | 'sports'
  | 'other';

export type UserRole = 'student' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  campusId?: string;
  phone?: string;
  createdAt: string;
}

export interface ItemReport {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  category: ItemCategory;
  location: string;
  dateReported: string;
  dateLostOrFound: string;
  status: ItemStatus;
  reporterId: string;
  reporterName: string;
  /**
   * Phone or direct contact info.
   * Under security & privacy rules, this is strictly redacted for public visitors
   * and only accessible to authenticated campus users.
   */
  contactPhone?: string;
  contactEmail?: string;
  images?: string[];
  isFlagged?: boolean;
  flagReason?: string;
  resolvedAt?: string;
}

export interface FlaggedReport {
  id: string;
  reportId: string;
  itemTitle: string;
  reportedByUserId: string;
  reportedByUserName: string;
  flagReason: 'inappropriate_content' | 'spam' | 'incorrect_information' | 'fraud' | 'other';
  flagDetails: string;
  flaggedAt: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  reviewerNotes?: string;
}

export interface FilterParams {
  query?: string;
  type?: ReportType | 'all';
  category?: ItemCategory | 'all';
  status?: ItemStatus | 'all';
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}


export interface ClaimReport {
  claim_id: number;
  item_id: number;
  user_id: number;
  claim_details: string;
  claim_status: 'pending' | 'approved' | 'rejected';
  admin_review: string | null;
  reviewed_by: number | null;
  claim_date: string;
  reviewed_at: string | null;
}
