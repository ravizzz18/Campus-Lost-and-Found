import { ItemReport, FilterParams, FlaggedReport } from '@/types';
import { SAMPLE_REPORTS, SAMPLE_FLAGGED_REPORTS } from './mockData';

/**
 * Campus Lost & Found — Reports Service Layer
 * 
 * Provides clean frontend service interfaces with strict privacy controls.
 * Prepares contracts for direct FastAPI integration:
 * - Public endpoints: do not receive or return reporter phone numbers.
 * - Authenticated endpoints: require session authorization before exposing contact details.
 */

// In-memory development fixture store
let currentReports: ItemReport[] = [...SAMPLE_REPORTS];
let currentFlags: FlaggedReport[] = [...SAMPLE_FLAGGED_REPORTS];

export class ReportsService {
  /**
   * Fetches public listings with all sensitive contact information stripped.
   */
  public static async getPublicReports(filters?: FilterParams): Promise<ItemReport[]> {
    // Simulate realistic network latency for UI testing
    await new Promise((res) => setTimeout(res, 120));

    let items = currentReports.map(this.sanitizePublicReport);

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        items = items.filter((i) => i.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        items = items.filter((i) => i.category === filters.category);
      }
      if (filters.location && filters.location !== 'all') {
        items = items.filter((i) => i.location === filters.location);
      }
      if (filters.status && filters.status !== 'all') {
        items = items.filter((i) => i.status === filters.status);
      }
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        items = items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        );
      }
    }

    return items;
  }

  /**
   * Fetches single report without private contact information.
   */
  public static async getPublicReportById(id: string): Promise<ItemReport | null> {
    await new Promise((res) => setTimeout(res, 80));
    const match = currentReports.find((r) => r.id === id);
    return match ? this.sanitizePublicReport(match) : null;
  }

  /**
   * Secure Contact Retrieval Endpoint:
   * Strictly enforces authenticated access. Unauthenticated requests are rejected.
   */
  public static async getReporterContact(
    reportId: string,
    isAuthenticated: boolean
  ): Promise<{ phone: string; email: string; reporterName: string }> {
    await new Promise((res) => setTimeout(res, 100));

    if (!isAuthenticated) {
      throw new Error('UNAUTHORIZED: Contact information requires verified campus authentication.');
    }

    const report = currentReports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error('Report not found.');
    }

    return {
      phone: report.contactPhone || '+1 (555) 019-0000',
      email: report.contactEmail || 'reporter@campus.edu',
      reporterName: report.reporterName,
    };
  }

  /**
   * Submits a new report (Lost or Found).
   * Published immediately to the directory.
   */
  public static async createReport(
    reportData: Omit<ItemReport, 'id' | 'dateReported' | 'status'>
  ): Promise<ItemReport> {
    await new Promise((res) => setTimeout(res, 200));

    const newReport: ItemReport = {
      ...reportData,
      id: `clf-${Math.floor(100 + Math.random() * 900)}`,
      dateReported: new Date().toISOString().split('T')[0],
      status: 'open',
    };

    // Prepend to store
    currentReports = [newReport, ...currentReports];
    return newReport;
  }

  /**
   * Updates report resolution status.
   * Enforces rule: ONLY the original reporter can mark a report resolved.
   */
  public static async setReportResolution(
    reportId: string,
    userId: string,
    resolved: boolean
  ): Promise<ItemReport> {
    await new Promise((res) => setTimeout(res, 150));

    const report = currentReports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error('Report not found.');
    }

    // Authorization verification
    if (report.reporterId !== userId) {
      throw new Error('FORBIDDEN: Only the original reporter is permitted to resolve this listing.');
    }

    report.status = resolved ? 'resolved' : 'open';
    report.resolvedAt = resolved ? new Date().toISOString() : undefined;

    return { ...report };
  }

  /**
   * Submits a moderation flag for an inappropriate/inaccurate report.
   */
  public static async submitFlag(
    reportId: string,
    reason: FlaggedReport['flagReason'],
    details: string,
    userId: string,
    userName: string
  ): Promise<FlaggedReport> {
    await new Promise((res) => setTimeout(res, 150));

    const report = currentReports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error('Report not found.');
    }

    const newFlag: FlaggedReport = {
      id: `flg-${Math.floor(500 + Math.random() * 500)}`,
      reportId,
      itemTitle: report.title,
      reportedByUserId: userId,
      reportedByUserName: userName,
      flagReason: reason,
      flagDetails: details,
      flaggedAt: new Date().toISOString(),
      status: 'pending',
    };

    currentFlags = [newFlag, ...currentFlags];
    report.isFlagged = true;

    return newFlag;
  }

  /**
   * Administrative queue retrieval.
   */
  public static async getFlaggedQueue(isAdmin: boolean): Promise<FlaggedReport[]> {
    if (!isAdmin) {
      throw new Error('FORBIDDEN: Admin privileges required to view moderation queue.');
    }
    await new Promise((res) => setTimeout(res, 100));
    return [...currentFlags];
  }

  /**
   * Administrative decision execution.
   */
  public static async resolveFlag(
    flagId: string,
    action: 'approved' | 'removed',
    isAdmin: boolean,
    notes?: string
  ): Promise<void> {
    if (!isAdmin) {
      throw new Error('FORBIDDEN: Admin privileges required.');
    }
    await new Promise((res) => setTimeout(res, 120));

    const flag = currentFlags.find((f) => f.id === flagId);
    if (flag) {
      flag.status = action === 'approved' ? 'reviewed' : 'action_taken';
      flag.reviewerNotes = notes;
    }

    if (action === 'removed' && flag) {
      currentReports = currentReports.filter((r) => r.id !== flag.reportId);
    }
  }

  /**
   * Strips all private contact info from public models.
   */
  private static sanitizePublicReport(report: ItemReport): ItemReport {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contactPhone, contactEmail, ...safeReport } = report;
    return safeReport;
  }
}
