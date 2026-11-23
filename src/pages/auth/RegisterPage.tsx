import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, Mail, Lock, User, Building, IdCard } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campusId, setCampusId] = useState('');
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loginAsDemoUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In CLF-21 frontend milestone, set demo user and navigate to dashboard
    loginAsDemoUser(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-royal-50 text-royal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-subtle border border-royal-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            Create Campus Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join the verified university network to report, track, and reclaim belongings.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Taylor"
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Campus Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campus.edu"
              helperText="Must end in your official university domain."
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Campus Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'staff')}
                  className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 text-slate-700"
                >
                  <option value="student">Student</option>
                  <option value="staff">Faculty / Staff</option>
                </select>
              </div>

              <Input
                label="Student / Staff ID Number"
                type="text"
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                placeholder="e.g. STU-2024-8821"
                required
                leftIcon={<IdCard className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Department / Faculty"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              leftIcon={<Building className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to comply with campus honor codes and safety regulations when recovering belongings.
            </div>

            <Button type="submit" variant="primary" className="w-full" size="md">
              Complete Campus Registration
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-royal-600 hover:text-royal-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
