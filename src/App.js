import { useState, useEffect, Component } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "@aws-amplify/ui-react/styles.css"

import WelcomePage from "./components/WelcomePage"
import Dashboard from "./components/Dashboard"
import Navigation from "./components/Navigation"
import "./App.css"

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack: {this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Navigation />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
