import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - MOCEAN</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* 404 Icon */}
            <div className="mx-auto w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>

            {/* 404 Number */}
            <div className="text-6xl font-bold text-secondary-300 mb-4">
              404
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              Page Not Found
            </h1>
            
            <p className="text-secondary-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Homepage
              </Link>
              
              <Link
                href="/intake"
                className="block w-full bg-secondary-200 text-secondary-800 py-3 px-4 rounded-lg font-medium hover:bg-secondary-300 transition-colors"
              >
                Start Health Assessment
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-secondary-100 text-secondary-600 py-3 px-4 rounded-lg font-medium hover:bg-secondary-200 transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-secondary-200">
              <p className="text-sm text-secondary-500 mb-4">Looking for something specific?</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link href="/staff/dashboard" className="text-primary-600 hover:text-primary-700">
                  Staff Dashboard
                </Link>
                <Link href="/ai-demo" className="text-primary-600 hover:text-primary-700">
                  AI Demo
                </Link>
                <Link href="/result-demo" className="text-primary-600 hover:text-primary-700">
                  Results Demo
                </Link>
                <Link href="/design-demo" className="text-primary-600 hover:text-primary-700">
                  Design Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 