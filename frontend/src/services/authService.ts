
import { UserProfile, UserRole } from '@/types';
import { ApiService } from './api';

const SESSION_STORAGE_KEY = 'clf_session_user';
const TOKEN_STORAGE_KEY = 'clf_auth_token';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'student' | 'staff';
  department?: string;
  campusId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface BackendUser {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
}

interface BackendToken {
  access_token: string;
  token_type: string;
}

export class AuthService {
  public static getCurrentUser(): UserProfile | null {
    try {
      const stored =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY);

      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  public static getToken(): string | null {
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      sessionStorage.getItem(TOKEN_STORAGE_KEY)
    );
  }

  private static mapUser(user: BackendUser): UserProfile {
    return {
      id: String(user.user_id),
      name: user.full_name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: new Date().toISOString(),
    };
  }

  private static saveSession(
    user: UserProfile,
    token: string,
    remember = true
  ): void {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    storage.setItem(TOKEN_STORAGE_KEY, token);

    otherStorage.removeItem(SESSION_STORAGE_KEY);
    otherStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  public static async login(
    payload: LoginPayload
  ): Promise<UserProfile> {
    if (!payload.email.trim() || !payload.password) {
      throw new Error('Please provide both email and password.');
    }

    const formData = new URLSearchParams();
    formData.append('username', payload.email.trim());
    formData.append('password', payload.password);

    const tokenResponse = await ApiService.request<BackendToken>(
      '/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    );

    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      tokenResponse.access_token
    );

    try {
      const backendUser = await ApiService.request<BackendUser>(
        '/auth/me'
      );

      const user = this.mapUser(backendUser);
      this.saveSession(user, tokenResponse.access_token);

      return user;
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      throw error;
    }
  }

  public static async register(
    payload: RegisterPayload
  ): Promise<UserProfile> {
    if (
      !payload.name.trim() ||
      !payload.email.trim() ||
      !payload.phone.trim() ||
      !payload.password
    ) {
      throw new Error('All required registration fields must be completed.');
    }

    if (payload.password.length < 8) {
      throw new Error('Password must contain at least 8 characters.');
    }

    await ApiService.request<BackendUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password,
        role: 'student',
      }),
    });

    // Registration does not issue a token, so log in afterwards.
    return this.login({
      email: payload.email,
      password: payload.password,
    });
  }

  public static async updateProfile(
    _userId: string,
    _updates: Partial<
      Pick<UserProfile, 'name' | 'phone' | 'department'>
    >
  ): Promise<UserProfile> {
    throw new Error(
      'Profile updates are not yet supported by the backend.'
    );
  }

  public static async logout(): Promise<void> {
    const token = this.getToken();

    try {
      if (token && !token.startsWith('clf_mock_jwt_')) {
        await ApiService.request('/auth/logout', {
          method: 'POST',
        });
      }
    } finally {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  // Local-only demo accounts for UI evaluation.
  public static switchDemoRole(
    role: 'student' | 'staff' | 'admin'
  ): UserProfile {
    const isAdmin = role === 'admin';
    const isStaff = role === 'staff';

    const user: UserProfile = {
      id: isAdmin
        ? 'usr-admin-01'
        : isStaff
          ? 'usr-staff-01'
          : 'usr-student-01',
      name: isAdmin
        ? 'Administrator Sarah'
        : isStaff
          ? 'Prof. David Miller'
          : 'Jordan Taylor',
      email: isAdmin
        ? 'admin.lostfound@campus.edu'
        : isStaff
          ? 'david.miller@campus.edu'
          : 'jordan.t@campus.edu',
      role,
      department: isAdmin
        ? 'Campus Safety & Student Affairs'
        : isStaff
          ? 'Electrical Engineering'
          : 'Computer Science & Engineering',
      campusId: isAdmin
        ? 'STAFF-ADMIN-01'
        : isStaff
          ? 'FAC-8812'
          : 'STU-2024-8821',
      phone: '+1 (555) 019-4567',
      createdAt: '2026-09-01',
    };

    this.saveSession(user, `clf_mock_jwt_${role}`);
    return user;
  }
}
