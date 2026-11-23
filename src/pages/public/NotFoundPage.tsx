import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto shadow-subtle border border-slate-200">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs uppercase font-mono font-semibold text-royal-600 tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight mt-1">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The page or report you are looking for does not exist or has been moved within the directory.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Browse Items
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
