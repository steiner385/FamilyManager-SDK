import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  testErrorTrigger?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.props.testErrorTrigger) {
      throw new Error('Test error triggered');
    }
    
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="max-w-max mx-auto">
            <main className="sm:flex">
              <p className="text-4xl font-bold text-red-600 sm:text-5xl">500</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                    Something went wrong
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reload page
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Go back home
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
