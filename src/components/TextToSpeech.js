"use client"

import { useState, useRef, useEffect } from "react"
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faMicrophone, 
  faPlay, 
  faPause, 
  faStop, 
  faVolumeUp, 
  faExclamationTriangle,
  faCheckCircle,
  faLanguage
} from "@fortawesome/free-solid-svg-icons"
import "animate.css"

const TextToSpeech = () => {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(true)
  const [voices, setVoices] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const speechSynthesisRef = useRef(window.speechSynthesis)
  const utteranceRef = useRef(null)

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "hi", name: "Hindi" }
  ]

  // Check if Web Speech API is supported and load voices
  useEffect(() => {
    const checkWebSpeechSupport = () => {
      if ('speechSynthesis' in window) {
        setIsWebSpeechSupported(true);
        
        // Load voices
        const loadVoices = () => {
          const availableVoices = speechSynthesisRef.current.getVoices();
          console.log("Available voices:", availableVoices);
          
          // Group voices by language
          const voicesByLang = availableVoices.reduce((acc, voice) => {
            const langCode = voice.lang.split('-')[0];
            if (!acc[langCode]) {
              acc[langCode] = [];
            }
            acc[langCode].push(voice);
            return acc;
          }, {});
          
          setVoices(voicesByLang);
          
          // Set default voice if available
          if (voicesByLang.en && voicesByLang.en.length > 0) {
            setVoice(voicesByLang.en[0].name);
          }
        };
        
        // Some browsers need a small delay to load voices
        if (speechSynthesisRef.current.getVoices().length > 0) {
          loadVoices();
        } else {
          speechSynthesisRef.current.addEventListener('voiceschanged', loadVoices);
        }
      } else {
        setIsWebSpeechSupported(false);
        setError('Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.');
      }
    };

    checkWebSpeechSupport();
    
    // Cleanup
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value)
    setSuccessMessage("")
  }

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    
    // Set first voice of selected language as default
    if (voices[newLang] && voices[newLang].length > 0) {
      setVoice(voices[newLang][0].name);
    }
    
    setSuccessMessage("");
  }

  const handleVoiceChange = (e) => {
    setVoice(e.target.value)
    setSuccessMessage("")
  }

  const convertTextToSpeech = () => {
    if (!text.trim()) {
      setError("Please enter some text to convert")
      return
    }

    try {
      setError("")
      setIsProcessing(true)
      setSuccessMessage("")
      
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Set voice if selected
      if (voice) {
        const selectedVoice = speechSynthesisRef.current.getVoices().find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log("Selected voice:", selectedVoice);
        }
      }
      
      // Set properties
      utterance.rate = 1.0; // Speed
      utterance.pitch = 1.0; // Pitch
      utterance.volume = 1.0; // Volume
      
      // Handle events
      utterance.onstart = () => {
        console.log("Speech started");
        setIsProcessing(false);
        setIsSpeaking(true);
        setIsPaused(false);
        setSuccessMessage("Speech started successfully!");
      };
      
      utterance.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
        setIsPaused(false);
        setSuccessMessage("Speech completed successfully!");
      };
      
      utterance.onpause = () => {
        console.log("Speech paused");
        setIsPaused(true);
      };
      
      utterance.onresume = () => {
        console.log("Speech resumed");
        setIsPaused(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError(`Speech synthesis error: ${event.error}`);
        setIsProcessing(false);
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      // Speak
      console.log("Starting speech synthesis");
      speechSynthesisRef.current.speak(utterance);
    } catch (err) {
      setError("Error converting text to speech: " + err.message);
      setIsProcessing(false);
      setIsSpeaking(false);
      setIsPaused(false);
      console.error("Error converting text to speech:", err);
    }
  }

  const pauseSpeech = () => {
    if (speechSynthesisRef.current && isSpeaking && !isPaused) {
      speechSynthesisRef.current.pause();
    }
  }

  const resumeSpeech = () => {
    if (speechSynthesisRef.current && isSpeaking && isPaused) {
      speechSynthesisRef.current.resume();
    }
  }

  const stopSpeech = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }

  return (
    <div className="text-to-speech-container animate__animated animate__fadeIn">
      <div className="text-center mb-4">
        <FontAwesomeIcon icon={faVolumeUp} size="3x" className="text-primary mb-3 animate__animated animate__pulse animate__infinite" />
        <h3 className="animate__animated animate__fadeInDown">Text to Speech</h3>
        <p className="text-muted animate__animated animate__fadeInUp">Convert your text to speech using Web Speech API</p>
      </div>

      {!isWebSpeechSupported && (
        <Alert variant="warning" className="mb-3 animate__animated animate__shakeX">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.
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
            <Form.Group className="mb-3">
              <Form.Label>Enter your text</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here..."
                className="text-input"
              />
            </Form.Group>

            <Form.Group className="mb-4 language-selector">
              <Form.Label>
                <FontAwesomeIcon icon={faLanguage} className="me-2" />
                Select Language
              </Form.Label>
              <Form.Select 
                value={selectedLanguage} 
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {voices[selectedLanguage] && voices[selectedLanguage].length > 0 && (
              <Form.Group className="mb-4 voice-selector">
                <Form.Label>
                  <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
                  Select Voice
                </Form.Label>
                <Form.Select value={voice} onChange={handleVoiceChange}>
                  {voices[selectedLanguage].map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex gap-3 mb-3">
              <Button 
                variant="primary" 
                onClick={convertTextToSpeech} 
                disabled={isProcessing || !text.trim() || !isWebSpeechSupported || isSpeaking}
                className="animate__animated animate__pulse animate__infinite"
              >
                {isProcessing ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlay} className="me-2" />
                    Convert to Speech
                  </>
                )}
              </Button>
              
              {isSpeaking && (
                <>
                  {isPaused ? (
                    <Button variant="success" onClick={resumeSpeech} className="animate__animated animate__fadeIn">
                      <FontAwesomeIcon icon={faPlay} className="me-2" />
                      Resume
                    </Button>
                  ) : (
                    <Button variant="warning" onClick={pauseSpeech} className="animate__animated animate__fadeIn">
                      <FontAwesomeIcon icon={faPause} className="me-2" />
                      Pause
                    </Button>
                  )}
                  <Button variant="danger" onClick={stopSpeech} className="animate__animated animate__fadeIn">
                    <FontAwesomeIcon icon={faStop} className="me-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {isSpeaking && (
        <Card className="mt-3 shadow-sm animate__animated animate__fadeIn">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
            Speech Status
          </Card.Header>
          <Card.Body>
            <p className="animate__animated animate__pulse animate__infinite">
              {isPaused ? "Speech is paused" : "Speech is playing"}
            </p>
            <p className="text-muted small">
              If you don't hear anything, check your browser's sound settings or try a different browser.
              Chrome, Edge, and Safari have the best support for the Web Speech API.
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default TextToSpeech
