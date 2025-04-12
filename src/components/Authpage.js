"use client"

import { useState } from "react"
import { Container, Card, Form, Button, Alert } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if already authenticated
  if (localStorage.getItem('isAuthenticated') === 'true' || authenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Simulate authentication success for development
    console.log('Form submitted:', { email, password, isSignUp });
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      setIsLoading(false);
      setAuthenticated(true);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Container className="auth-container">
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            {isSignUp ? 'Create an Account' : 'Sign In'}
          </Card.Title>
          
          <div className="mb-4">
            <Button 
              variant={isSignUp ? "outline-primary" : "primary"} 
              className="me-2"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </Button>
            <Button 
              variant={isSignUp ? "primary" : "outline-primary"}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required 
              />
            </Form.Group>
            
            {isSignUp && (
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password" 
                  required 
                />
              </Form.Group>
            )}
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AuthPage
