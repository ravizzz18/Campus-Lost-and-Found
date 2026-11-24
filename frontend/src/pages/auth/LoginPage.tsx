import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, ShieldCheck, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginAsDemoUser, isLoading } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your registered email and password.');
      return;
    }

    try {
      await login({ email, password });
      navigate(redirectPath);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify and retry.');
    }
  };

  const handleDemoLogin = (role: 'student' | 'admin') => {
    loginAsDemoUser(role);
    if (role === 'admin') {
      navigate('/admin/flagged-reports');
    } else {
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-royal-50 text-royal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-subtle border border-royal-100">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            Sign in to Campus Portal
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Access your lost item reports, claims, and verified contact directory.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-6 sm:p-8 space-y-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campus / Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jordan.taylor@campus.edu"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-royal-600 focus:ring-royal-500 h-4 w-4 mr-2"
                />
                Remember this session
              </label>
              <button
                type="button"
                onClick={() => alert('Password recovery: Contact the campus IT helpdesk at helpdesk@campus.edu.')}
                className="text-royal-600 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="md"
              isLoading={isLoading}
            >
              Sign In to Campus Directory
            </Button>
          </form>

          {/* Quick Preview Login for Evaluators / Milestone Review */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2.5">
              Instant Testing Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('student')}
                leftIcon={<User className="w-3.5 h-3.5" />}
              >
                Student Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-rose-500" />}
              >
                Admin Demo
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-royal-600 hover:text-royal-700">
            Register your student or staff ID
          </Link>
        </p>
      </div>
    </div>
  );
};
