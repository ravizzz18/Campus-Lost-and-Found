import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { BrowseItemsPage } from '@/pages/public/BrowseItemsPage';
import { ItemDetailsPage } from '@/pages/public/ItemDetailsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Authenticated Application Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ReportLostPage } from '@/pages/reports/ReportLostPage';
import { ReportFoundPage } from '@/pages/reports/ReportFoundPage';
import { MyReportsPage } from '@/pages/reports/MyReportsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';

// Admin Moderation Pages
import { FlaggedReportsPage } from '@/pages/admin/FlaggedReportsPage';
import { ReportReviewPage } from '@/pages/admin/ReportReviewPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowseItemsPage />} />
        <Route path="/item/:id" element={<ItemDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated User Pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report-lost" element={<ReportLostPage />} />
        <Route path="/report-found" element={<ReportFoundPage />} />
        <Route path="/my-reports" element={<MyReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Pages */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="flagged-reports" element={<FlaggedReportsPage />} />
        <Route path="review/:id" element={<ReportReviewPage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
