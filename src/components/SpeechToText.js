"use client"

import { useState, useEffect, useRef } from 'react';
import { Button, Form, Alert, Spinner, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faExclamationTriangle,
  faCheckCircle,
  faLanguage,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import "animate.css";

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [successMessage, setSuccessMessage] = useState('');
  
  const recognitionRef = useRef(null);

  const languages = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-GB', name: 'English (UK)' },
    { id: 'es-ES', name: 'Spanish' },
    { id: 'fr-FR', name: 'French' },
    { id: 'de-DE', name: 'German' },
    { id: 'ja-JP', name: 'Japanese' }
  ];

  // Check if Web Speech API is supported
  useEffect(() => {
    const checkWebSpeechSupport = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsWebSpeechSupported(true);
      } else {
        setIsWebSpeechSupported(false);
        setError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      }
    };

    checkWebSpeechSupport();
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setSuccessMessage('');
  };

  const startRecording = () => {
    try {
      setError('');
      setTranscript('');
      setIsRecording(true);
      setSuccessMessage('');
      
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      // Handle results
      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setSuccessMessage('Speech recognition in progress...');
        }
      };
      
      // Handle errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setSuccessMessage('');
      };
      
      // Handle end of recognition
      recognition.onend = () => {
        if (isRecording) {
          // Restart if we're still supposed to be recording
          recognition.start();
        } else {
          setSuccessMessage('Speech recognition completed successfully!');
        }
      };
      
      // Start recognition
      recognition.start();
      setSuccessMessage('Speech recognition started!');
    } catch (err) {
      setError(`Speech recognition error: ${err.message}`);
      setIsRecording(false);
      setSuccessMessage('');
      console.error("Speech recognition error:", err);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="speech-to-text-container animate__animated animate__fadeIn">
      <div className="text-center mb-4">
        <FontAwesomeIcon icon={faMicrophone} size="3x" className="text-primary mb-3 animate__animated animate__pulse animate__infinite" />
        <h3 className="animate__animated animate__fadeInDown">Speech to Text</h3>
        <p className="text-muted animate__animated animate__fadeInUp">Convert your voice to text using Web Speech API</p>
      </div>

      {!isWebSpeechSupported && (
        <Alert variant="warning" className="mb-3 animate__animated animate__shakeX">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-3 animate__animated animate__shakeX">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-3 animate__animated animate__fadeIn">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          {successMessage}
        </Alert>
      )}

      <Card className="shadow-sm mb-4 animate__animated animate__fadeInUp">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3 language-selector">
              <Form.Label>
                <FontAwesomeIcon icon={faLanguage} className="me-2" />
                Select Language
              </Form.Label>
              <Form.Select 
                value={language} 
                onChange={handleLanguageChange}
                className="mb-4"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-center gap-2 mb-4">
              {isRecording ? (
                <Button 
                  variant="danger" 
                  onClick={stopRecording}
                  className="recording-button animate__animated animate__pulse animate__infinite"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faStop} className="me-2" />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={startRecording}
                  className="record-button animate__animated animate__fadeIn"
                  size="lg"
                  disabled={!isWebSpeechSupported}
                >
                  <FontAwesomeIcon icon={faMicrophone} className="me-2" />
                  Start Recording
                </Button>
              )}
            </div>

            <Card className="transcript-card">
              <Card.Header className="bg-primary text-white">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Transcript
              </Card.Header>
              <Card.Body>
                {transcript ? (
                  <p className="transcript-text">{transcript}</p>
                ) : (
                  <p className="text-muted text-center">
                    {isRecording ? 'Listening...' : 'Your transcript will appear here'}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SpeechToText;