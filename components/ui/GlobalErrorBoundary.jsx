import React from 'react';
import Link from 'next/link';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // In production, you would send this to your error reporting service
    // this.reportError(error, errorInfo, errorId);
  }

  reportError = (error, errorInfo, errorId) => {
    // Example error reporting to external service
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service (e.g., Sentry, LogRocket, etc.)
      console.log('Reporting error to service:', { errorId, error: error.message, stack: error.stack });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                Something went wrong
              </h1>
              
              <p className="text-secondary-600 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
              </p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <div className="bg-secondary-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-secondary-700 mb-2">
                    <strong>Error ID:</strong> {this.state.errorId}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Please include this ID when contacting support.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
                
                <Link
                  href="/"
                  className="block w-full bg-secondary-200 text-secondary-800 py-3 px-4 rounded-lg font-medium hover:bg-secondary-300 transition-colors"
                >
                  Go to Homepage
                </Link>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-secondary-700 hover:text-secondary-900">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-4 bg-red-50 rounded-lg">
                    <pre className="text-xs text-red-800 overflow-auto">
                      {this.state.error && this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary; 