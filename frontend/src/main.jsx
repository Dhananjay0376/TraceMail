import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TraceMail React Crash:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#050814', color: '#f87171', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ color: '#ef4444', fontSize: '20px' }}>⚠️ TraceMail UI Component Crash Detected</h2>
          <p style={{ color: '#fca5a5', marginTop: '10px' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', color: '#94a3b8', overflowX: 'auto', marginTop: '16px', fontSize: '12px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Local Storage & Reload
          </button>
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
  </React.StrictMode>,
)
