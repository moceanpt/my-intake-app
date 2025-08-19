import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

function Error({ statusCode, err }) {
  const getErrorContent = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Page Not Found',
          message: 'The page you\'re looking for doesn\'t exist.',
          icon: (
            <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          )
        };
      case 500:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          icon: (
            <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      default:
        return {
          title: 'An Error Occurred',
          message: 'Something unexpected happened. Please try again.',
          icon: (
            <svg className="w-16 h-16 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <>
      <Head>
        <title>{errorContent.title} - MOCEAN</title>
        <meta name="description" content={errorContent.message} />
      </Head>
      
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              {errorContent.icon}
            </div>

            {/* Error Code */}
            <div className="text-6xl font-bold text-secondary-300 mb-4">
              {statusCode}
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              {errorContent.title}
            </h1>
            
            <p className="text-secondary-600 mb-8">
              {errorContent.message}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Homepage
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-secondary-200 text-secondary-800 py-3 px-4 rounded-lg font-medium hover:bg-secondary-300 transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && err && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm font-medium text-secondary-700 hover:text-secondary-900">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-red-50 rounded-lg">
                  <pre className="text-xs text-red-800 overflow-auto">
                    {err.toString()}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err };
};

export default Error; 