import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { RefreshCw } from 'lucide-react';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-red-50 rounded-lg">
      <div className="text-red-600 mb-6">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        <RefreshCw size={18} />
        Try again
      </button>
    </div>
  );
};

export default ErrorFallback;