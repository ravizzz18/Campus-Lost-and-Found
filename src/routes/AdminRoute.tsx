import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loginAsDemoUser } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-xl border border-slate-200 p-8 shadow-card text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy-800">Admin Clearance Required</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested admin review desk is restricted to authorized campus staff and moderators.
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => loginAsDemoUser('admin')}
          >
            Switch to Admin Preview Role
          </Button>

          <Link to="/" className="block">
            <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Public Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
