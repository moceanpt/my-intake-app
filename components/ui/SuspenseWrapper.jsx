import React, { Suspense } from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p className="text-sm text-secondary-600">{text}</p>
    </div>
  </div>
);

const SuspenseWrapper = ({ children, loadingText = 'Loading...' }) => {
  return (
    <Suspense fallback={<LoadingSpinner text={loadingText} />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper; 