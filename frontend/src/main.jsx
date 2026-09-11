import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TraceMail ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050814] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-[#0b1026] border border-red-500/30 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold text-2xl font-mono">
              !
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Application Render Exception</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                An unhandled runtime error occurred during rendering.
              </p>
            </div>
            <div className="bg-[#050814] p-4 rounded-xl text-left border border-white/10 overflow-x-auto text-xs font-mono text-red-400 max-h-48">
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && (
                <pre className="text-[10px] text-slate-500 mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = window.location.origin;
              }}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-mono"
            >
              Reset Session &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
