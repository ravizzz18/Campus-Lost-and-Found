import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import {
  Mail,
  IdCard,
  Building,
  Phone,
  ShieldCheck,
  CheckCircle,
  LogOut,
  User,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-4567');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (!phone.trim()) {
      setError('A valid phone number is required for verified item recovery.');
      return;
    }

    try {
      await updateProfile({ phone, department });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile settings.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            Account Profile &amp; Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your campus directory credentials and verified contact number.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
          className="text-rose-700 hover:bg-rose-50 border-rose-200"
        >
          Sign Out
        </Button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Profile and recovery contact phone updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-card">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 text-white font-bold text-2xl flex items-center justify-center shadow-subtle flex-shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-navy-800">{user?.name || 'Campus Member'}</h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-royal-100 text-royal-700 border border-royal-200">
                {user?.role || 'student'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email || 'user@campus.edu'}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Campus User Identity</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={user?.name || ''}
              disabled
              leftIcon={<User className="w-4 h-4" />}
              helperText="Managed by university registry."
            />

            <Input
              label="User Type"
              type="text"
              value={user?.role === 'staff' ? 'College Staff / Faculty' : user?.role === 'admin' ? 'Campus Administrator' : 'Student'}
              disabled
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              helperText="Assigned access privilege level."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student / Staff ID"
              type="text"
              value={user?.campusId || 'STU-2024-8821'}
              disabled
              leftIcon={<IdCard className="w-4 h-4" />}
              helperText="Official university identifier."
            />

            <Input
              label="Registered Email Address"
              type="email"
              value={user?.email || 'user@campus.edu'}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Primary email cannot be altered."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department / Faculty"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Electrical Engineering"
              leftIcon={<Building className="w-4 h-4" />}
              helperText="Your academic or administrative department."
            />

            <Input
              label="Recovery Contact Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-4567"
              leftIcon={<Phone className="w-4 h-4" />}
              helperText="Protected: Only revealed to authenticated users."
              required
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <strong>Privacy Policy Notice:</strong> Your phone number is never shared with third parties or indexed by search engines. It serves solely to connect you with peers who have found or lost an item matching your reports.
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
