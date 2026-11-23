import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Mail, IdCard, Building, Phone, ShieldCheck, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-4567');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          User Profile &amp; Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your verified campus directory information and recovery contact preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Profile contact preferences updated successfully.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 text-white font-bold text-2xl flex items-center justify-center shadow-subtle">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-navy-800">{user?.name || 'Campus Member'}</h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-royal-100 text-royal-700">
                {user?.role || 'student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'user@campus.edu'}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Institutional Identity</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student / Staff ID"
              type="text"
              value={user?.campusId || 'STU-2024-8821'}
              disabled
              leftIcon={<IdCard className="w-4 h-4" />}
              helperText="Assigned by university administration."
            />

            <Input
              label="Institutional Email"
              type="email"
              value={user?.email || 'user@campus.edu'}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Primary email cannot be changed."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department / Faculty"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              leftIcon={<Building className="w-4 h-4" />}
            />

            <Input
              label="Default Contact Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              helperText="Only visible to logged-in campus users."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
