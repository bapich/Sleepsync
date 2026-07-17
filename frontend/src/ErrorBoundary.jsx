import { Component } from "react";
import { reportRuntimeError } from "./lib/runtime-monitor";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    reportRuntimeError(error, {
      source: "react.error-boundary",
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-shell">
          <div className="glass-card crash-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }} aria-hidden="true">️</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--color-text)" }}>
              Something went wrong
            </h1>
            <p style={{ color: "var(--color-text-2)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
