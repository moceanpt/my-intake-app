import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const SuspenseWrapper = ({ 
  children, 
  fallback = <LoadingSpinner text="Loading..." />,
  loadingText = "Loading...",
  className = ""
}) => {
  return (
    <Suspense 
      fallback={
        fallback || (
          <div className={`flex justify-center items-center p-8 ${className}`}>
            <LoadingSpinner text={loadingText} />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper; 