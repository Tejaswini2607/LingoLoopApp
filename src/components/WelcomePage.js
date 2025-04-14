import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faMicrophone, 
  faVolumeUp,
  faLanguage,
  faRocket,
  faSignInAlt
} from "@fortawesome/free-solid-svg-icons"
import "animate.css"

const WelcomePage = ({ user }) => {
  return (
    <Container className="welcome-container animate__animated animate__fadeIn">
      <Row className="mb-5">
        <Col className="text-center">
          <div className="animate__animated animate__fadeInDown animate__delay-1s">
            <FontAwesomeIcon 
              icon={faLanguage} 
              size="4x" 
              className="text-primary mb-4 animate__animated animate__pulse animate__infinite" 
            />
            <h1 className="display-4 mb-3">Welcome to LingoLoop</h1>
            <p className="lead mb-4">
              {user 
                ? `Hello ${user.username}! Ready to convert speech to text and text to speech?`
                : "Convert speech to text and text to speech with ease"
              }
            </p>
          </div>
          {user ? (
            <Button 
              as={Link} 
              to="/dashboard" 
              variant="primary" 
              size="lg" 
              className="mt-3 animate__animated animate__fadeInUp animate__delay-1s"
            >
              <FontAwesomeIcon icon={faRocket} className="me-2" />
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              as={Link} 
              to="/dashboard" 
              variant="primary" 
              size="lg" 
              className="mt-3 animate__animated animate__fadeInUp animate__delay-1s"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Sign In to Get Started
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mt-5 g-4">
        <Col md={6}>
          <Card className="feature-card h-100 animate__animated animate__fadeInLeft animate__delay-2s">
            <Card.Body className="text-center p-4">
              <FontAwesomeIcon 
                icon={faMicrophone} 
                size="3x" 
                className="text-primary mb-3" 
              />
              <Card.Title className="h4 mb-3">Speech to Text</Card.Title>
              <Card.Text className="text-muted">
                Record your voice and convert it to text using LingoLoop. Perfect for note-taking, transcriptions,
                and more.
              </Card.Text>
              <Button 
                as={Link} 
                to={user ? "/dashboard/speech-to-text" : "/dashboard"} 
                variant="outline-primary" 
                className="mt-3"
              >
                {user ? "Try Speech to Text" : "Sign In to Try"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="feature-card h-100 animate__animated animate__fadeInRight animate__delay-2s">
            <Card.Body className="text-center p-4">
              <FontAwesomeIcon 
                icon={faVolumeUp} 
                size="3x" 
                className="text-primary mb-3" 
              />
              <Card.Title className="h4 mb-3">Text to Speech</Card.Title>
              <Card.Text className="text-muted">
                Convert your text to natural-sounding speech using LingoLoop. Choose from multiple voices and languages.
              </Card.Text>
              <Button 
                as={Link} 
                to={user ? "/dashboard/text-to-speech" : "/dashboard"} 
                variant="outline-primary" 
                className="mt-3"
              >
                {user ? "Try Text to Speech" : "Sign In to Try"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default WelcomePage
