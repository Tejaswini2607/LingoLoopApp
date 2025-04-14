"use client"

import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

const Navigation = ({ signOut, user }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          LingoLoop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
          </Nav>
          {user && (
            <Nav>
              <Nav.Item className="d-flex align-items-center text-light me-3">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                {user.username}
              </Nav.Item>
              <Button 
                variant="outline-light" 
                onClick={signOut}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Sign Out
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
