'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050709', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 48, fontWeight: 900, letterSpacing: '1px', marginBottom: 12, color: '#ff4a4a' }}>SYSTEM FAILURE</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 400, textAlign: 'center', lineHeight: 1.6 }}>An anomaly was detected in the digital concierge core. Please refresh the grid to recalibrate the interface.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 32, padding: '12px 24px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.4)', color: '#00d4ff', borderRadius: 8, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700 }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
