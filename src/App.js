import { useState, useEffect, Component } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Amplify } from 'aws-amplify'
import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import awsconfig from './aws-exports'

import WelcomePage from "./components/WelcomePage"
import Dashboard from "./components/Dashboard"
import Navigation from "./components/Navigation"
import AuthComponent from "./components/Auth"
import "./App.css"

Amplify.configure(awsconfig)

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      console.log('User Attributes:', attributes); // Debug log
      
      const userData = {
        ...currentUser,
        name: attributes.name || attributes.preferred_username || currentUser.username,
        email: attributes.email,
        attributes: attributes
      };
      
      console.log('Processed User Data:', userData); // Debug log
      setUser(userData);
      setUserAttributes(attributes);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth Error:', err); // Debug log
      setUser(null);
      setUserAttributes(null);
      setIsAuthenticated(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setUserAttributes(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Navigation signOut={handleSignOut} user={user} />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<WelcomePage user={user} />} />
              <Route 
                path="/auth" 
                element={
                  !isAuthenticated ? (
                    <AuthComponent onAuthStateChange={checkAuthState} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                } 
              />
              <Route 
                path="/dashboard/*" 
                element={
                  isAuthenticated ? (
                    <Dashboard user={user} />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
