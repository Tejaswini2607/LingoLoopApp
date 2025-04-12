"use client"

import { Container, Tabs, Tab } from "react-bootstrap"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import SpeechToText from "./SpeechToText"
import TextToSpeech from "./TextToSpeech"

const Dashboard = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // Determine active tab based on current path
  let activeKey = "/dashboard/speech-to-text"
  if (currentPath.includes("text-to-speech")) {
    activeKey = "/dashboard/text-to-speech"
  }

  return (
    <Container className="dashboard-container">
      <h2 className="mb-4">Dashboard</h2>

      <Tabs
        activeKey={activeKey}
        className="mb-3"
        onSelect={(k) => null} // We're using React Router for navigation
      >
        <Tab
          eventKey="/dashboard/speech-to-text"
          title={
            <Link to="/dashboard/speech-to-text" className="text-decoration-none">
              Speech to Text
            </Link>
          }
        />
        <Tab
          eventKey="/dashboard/text-to-speech"
          title={
            <Link to="/dashboard/text-to-speech" className="text-decoration-none">
              Text to Speech
            </Link>
          }
        />
      </Tabs>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<SpeechToText />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
        </Routes>
      </div>
    </Container>
  )
}

export default Dashboard
