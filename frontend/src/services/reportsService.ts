
import { ItemReport, FilterParams, FlaggedReport } from '@/types';
import { ApiService } from './api';

interface BackendItem {
  item_id: number;
  user_id: number;
  item_name: string;
  description: string;
  category: string;
  location: string;
  report_type: 'Lost' | 'Found';
  report_date: string;
  image_path: string | null;
  status: string;
}

export class ReportsService {
  /**
   * Convert backend item data into the existing frontend interface.
   */
  private static mapBackendItem(item: BackendItem): ItemReport {
    const reportType = item.report_type.toLowerCase() as 'lost' | 'found';

    return {
      id: String(item.item_id),
      title: item.item_name,
      description: item.description,
      type: reportType,
      category: item.category as ItemReport['category'],
      location: item.location,
      dateReported: item.report_date,
      dateLostOrFound: item.report_date,
      status: item.status === 'active' ? 'open' : 'resolved',
      reporterId: String(item.user_id),
      reporterName: 'Campus member',
      images: item.image_path ? [item.image_path] : undefined,
    };
  }

  /**
   * Fetch all lost and found reports.
   */
  public static async getPublicReports(
    filters?: FilterParams
  ): Promise<ItemReport[]> {
    const [lostItems, foundItems] = await Promise.all([
      ApiService.request<BackendItem[]>('/items'),
      ApiService.request<BackendItem[]>('/found-items'),
    ]);

    let reports = [
      ...lostItems.map(this.mapBackendItem),
      ...foundItems.map(this.mapBackendItem),
    ];

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        reports = reports.filter(
          (item) => item.type === filters.type
        );
      }

      if (filters.category && filters.category !== 'all') {
        reports = reports.filter(
          (item) => item.category === filters.category
        );
      }

      if (filters.location && filters.location !== 'all') {
        reports = reports.filter((item) =>
          item.location.toLowerCase().includes(
            filters.location!.toLowerCase()
          )
        );
      }

      if (filters.status && filters.status !== 'all') {
        reports = reports.filter(
          (item) => item.status === filters.status
        );
      }

      if (filters.query?.trim()) {
        const query = filters.query.toLowerCase().trim();

        reports = reports.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
      }

      if (filters.dateFrom) {
        reports = reports.filter(
          (item) => item.dateLostOrFound >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        reports = reports.filter(
          (item) => item.dateLostOrFound <= filters.dateTo!
        );
      }
    }

    return reports.sort(
      (a, b) =>
        new Date(b.dateLostOrFound).getTime() -
        new Date(a.dateLostOrFound).getTime()
    );
  }

  /**
   * Fetch one report by ID.
   */
  public static async getPublicReportById(
    id: string
  ): Promise<ItemReport | null> {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return null;
    }

    const endpoints = ['/items', '/found-items'];

    for (const endpoint of endpoints) {
      try {
        const item = await ApiService.request<BackendItem>(
          `${endpoint}/${numericId}`
        );

        return this.mapBackendItem(item);
      } catch (error) {
        // Try the other report type only when the first lookup returns 404.
        if (
          !(error instanceof Error) ||
          !error.message.includes('not found')
        ) {
          throw error;
        }
      }
    }

    return null;
  }

  /**
   * Contact retrieval is not supported by the current backend.
   */
  public static async getReporterContact(
    _reportId: string,
    _isAuthenticated: boolean
  ): Promise<{
    phone: string;
    email: string;
    reporterName: string;
  }> {
    throw new Error(
      'Reporter contact retrieval is not yet supported by the backend.'
    );
  }

  /**
   * Create a real lost or found report.
   */
  public static async createReport(
    reportData: Omit<ItemReport, 'id' | 'dateReported' | 'status'>
  ): Promise<ItemReport> {
    // The current backend has no image upload/storage endpoint.
    if (reportData.images?.length) {
      throw new Error(
        'Image uploads are not yet supported by the backend. Please remove the photograph and submit the report again.'
      );
    }

    const isLost = reportData.type === 'lost';
    const endpoint = isLost ? '/items' : '/found-items';

    const payload = {
      item_name: reportData.title.trim(),
      description: reportData.description.trim(),
      category: reportData.category,
      location: reportData.location,
      report_type: isLost ? 'Lost' : 'Found',
      report_date: new Date(
        reportData.dateLostOrFound
      ).toISOString(),
    };

    const created = await ApiService.request<BackendItem>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    return this.mapBackendItem(created);
  }

  /**
   * Report resolution is not supported by the current ItemUpdate schema.
   */
  public static async setReportResolution(
    _reportId: string,
    _userId: string,
    _resolved: boolean
  ): Promise<ItemReport> {
    throw new Error(
      'Report resolution is not yet supported by the backend.'
    );
  }

  /**
   * Report flagging is not supported by the current backend.
   */
  public static async submitFlag(
    _reportId: string,
    _reason: FlaggedReport['flagReason'],
    _details: string,
    _userId: string,
    _userName: string
  ): Promise<FlaggedReport> {
    throw new Error(
      'Report flagging is not yet supported by the backend.'
    );
  }

  /**
   * Admin moderation queue is not supported by the current backend.
   */
  public static async getFlaggedQueue(
    isAdmin: boolean
  ): Promise<FlaggedReport[]> {
    if (!isAdmin) {
      throw new Error('FORBIDDEN: Admin privileges required.');
    }

    throw new Error(
      'The moderation queue is not yet supported by the backend.'
    );
  }

  /**
   * Admin flag resolution is not supported by the current backend.
   */
  public static async resolveFlag(
    _flagId: string,
    _action: 'approved' | 'removed',
    isAdmin: boolean,
    _notes?: string
  ): Promise<void> {
    if (!isAdmin) {
      throw new Error('FORBIDDEN: Admin privileges required.');
    }

    throw new Error(
      'Flag moderation is not yet supported by the backend.'
    );
  }
}
