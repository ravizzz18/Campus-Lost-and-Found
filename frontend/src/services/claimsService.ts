
import { ApiService } from './api';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  claim_id: number;
  item_id: number;
  user_id: number;
  claim_details: string;
  claim_status: ClaimStatus;
  admin_review: string | null;
  reviewed_by: number | null;
  claim_date: string;
  reviewed_at: string | null;
}

export interface CreateClaimPayload {
  item_id: number;
  claim_details: string;
}

export interface ReviewClaimPayload {
  claim_status: 'approved' | 'rejected';
  admin_review?: string;
}

export class ClaimsService {
  // Submit an ownership claim for a found item.
  static createClaim(payload: CreateClaimPayload): Promise<Claim> {
    return ApiService.request<Claim>('/claims', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Retrieve the current user's claims.
  // Admin users receive all claims from the backend.
  static getClaims(): Promise<Claim[]> {
    return ApiService.request<Claim[]>('/claims');
  }

  // Retrieve an individual claim.
  static getClaim(claimId: number): Promise<Claim> {
    return ApiService.request<Claim>(`/claims/${claimId}`);
  }

  // Approve or reject a pending claim (real admin authentication required).
  static reviewClaim(
    claimId: number,
    payload: ReviewClaimPayload
  ): Promise<Claim> {
    return ApiService.request<Claim>(`/claims/${claimId}/review`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }
}
