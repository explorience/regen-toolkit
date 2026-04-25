/**
 * Loading State Component
 * 
 * Skeleton loaders and error boundaries
 */

import React from 'react';

export const OrgChartSkeleton: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ height: '20px', background: '#27272a', borderRadius: '4px', marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} style={{ height: '120px', background: '#18181f', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
      ))}
    </div>
  </div>
);

export const TaskBoardSkeleton: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '2rem' }}>
    {[1, 2, 3, 4].map((col) => (
      <div key={col}>
        <div style={{ height: '20px', background: '#27272a', borderRadius: '4px', marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
        {[1, 2, 3].map((row) => (
          <div key={row} style={{ height: '100px', background: '#18181f', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 2s infinite' }} />
        ))}
      </div>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ height: '80px', background: '#18181f', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
      ))}
    </div>
    <OrgChartSkeleton />
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ padding: '2rem', color: '#ef4444' }}>
            <h3>Something went wrong</h3>
            <p>{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;
document.head.appendChild(style);
