"use client"

import { Container, Tabs, Tab, Alert } from "react-bootstrap"
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone, faVolumeUp } from "@fortawesome/free-solid-svg-icons"
import SpeechToText from "./SpeechToText"
import TextToSpeech from "./TextToSpeech"

const Dashboard = ({ user }) => {
  const location = useLocation()
  const currentPath = location.pathname

  if (!user) {
    return <Navigate to="/" replace />
  }

  // Determine active tab based on current path
  let activeKey = "/dashboard/speech-to-text"
  if (currentPath.includes("text-to-speech")) {
    activeKey = "/dashboard/text-to-speech"
  }

  return (
    <Container className="dashboard-container animate__animated animate__fadeIn">
      <div className="text-center mb-4">
        <h2 className="mb-3">Welcome, {user.username}!</h2>
        <Alert variant="info" className="text-center">
          Choose a feature below to get started
        </Alert>
      </div>

      <Tabs
        activeKey={activeKey}
        className="mb-4"
        onSelect={(k) => null} // We're using React Router for navigation
      >
        <Tab
          eventKey="/dashboard/speech-to-text"
          title={
            <Link to="/dashboard/speech-to-text" className="text-decoration-none">
              <FontAwesomeIcon icon={faMicrophone} className="me-2" />
              Speech to Text
            </Link>
          }
        />
        <Tab
          eventKey="/dashboard/text-to-speech"
          title={
            <Link to="/dashboard/text-to-speech" className="text-decoration-none">
              <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
              Text to Speech
            </Link>
          }
        />
      </Tabs>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<SpeechToText user={user} />} />
          <Route path="/speech-to-text" element={<SpeechToText user={user} />} />
          <Route path="/text-to-speech" element={<TextToSpeech user={user} />} />
        </Routes>
      </div>
    </Container>
  )
}

export default Dashboard
