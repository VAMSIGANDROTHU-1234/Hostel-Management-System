import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-3 my-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{this.props.fallbackTitle || 'Component Error Recovered'}</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            {this.state.error?.message || 'A UI component encountered an unexpected error.'}
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
