import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { signUp, signIn, confirmSignUp } from 'aws-amplify/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEnvelope, 
  faSignInAlt, 
  faUserPlus,
  faSpinner,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import 'animate.css';

const AuthComponent = ({ onAuthStateChange }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [signUpData, setSignUpData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        const signUpResult = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              name: name.trim(),
              preferred_username: name.trim()
            },
          },
        });
        console.log('Sign Up Result:', signUpResult); // Debug log
        setSignUpData({ email, name: name.trim() });
        setIsVerifying(true);
      } else {
        const signInResult = await signIn({ username: email, password });
        console.log('Sign In Result:', signInResult); // Debug log
        await onAuthStateChange(true);
      }
    } catch (err) {
      console.error('Auth Error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp({ 
        username: signUpData ? signUpData.email : email, 
        confirmationCode: verificationCode 
      });
      setIsSignUp(false);
      setIsVerifying(false);
      setError('Email verified! Please sign in with your credentials.');
      // Clear the form
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      setVerificationCode('');
      setSignUpData(null);
    } catch (err) {
      console.error('Verification Error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container animate__animated animate__fadeIn">
      <Card className="auth-card shadow-lg">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <FontAwesomeIcon 
              icon={isSignUp ? faUserPlus : faSignInAlt} 
              size="3x" 
              className="text-primary mb-3 animate__animated animate__pulse animate__infinite" 
            />
            <h2 className="mb-3">{isVerifying ? 'Verify Email' : (isSignUp ? 'Create Account' : 'Welcome Back')}</h2>
            <p className="text-muted">
              {isVerifying 
                ? 'Please enter the verification code sent to your email'
                : (isSignUp 
                  ? 'Join LingoLoop to start converting speech and text'
                  : 'Sign in to access your LingoLoop account')}
            </p>
          </div>

          {error && (
            <Alert variant={error.includes('verified') ? 'success' : 'danger'} className="animate__animated animate__shakeX">
              {error}
            </Alert>
          )}

          {isVerifying ? (
            <Form onSubmit={handleVerification}>
              <Form.Group className="mb-4">
                <Form.Label>Verification Code</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <Form.Control
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    required
                  />
                </div>
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Verify Email'
                )}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit}>
              {isSignUp && (
                <Form.Group className="mb-4">
                  <Form.Label>Your Name</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faIdCard} />
                    </span>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </Form.Group>

              {isSignUp && (
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </Form.Group>
              )}

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setName('');
                  }}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthComponent; 