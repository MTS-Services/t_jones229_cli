"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service if needed
    if (typeof window !== 'undefined') {
      // You can send to analytics/error tracking service here
      // Prevent infinite reload loops by not auto-reloading
      // This is especially critical on iOS Safari with API failures
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We're working to fix the issue. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              // Navigate to home instead of reload to prevent infinite loops
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0037FF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
