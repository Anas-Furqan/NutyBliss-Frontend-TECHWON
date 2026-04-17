'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/15">
          <FiAlertTriangle className="h-10 w-10 text-red-300" />
        </div>

        <h1 className="mb-4 font-display text-2xl font-bold text-slate-100 md:text-3xl">
          Oops! Something went wrong
        </h1>

        <p className="mb-8 text-slate-300">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or contact support if the problem persists.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left">
            <p className="break-all font-mono text-sm text-red-200">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link href="/" className="btn-outline flex items-center justify-center gap-2">
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
