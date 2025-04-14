import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const WelcomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to LingoLoop
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          Your Voice-to-Text & Text-to-Speech Companion
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Record your voice and let LingoLoop convert it to text instantly
          </Typography>
          <Typography variant="body1" paragraph>
            Type your text and let LingoLoop convert it to natural-sounding speech
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Powered by Web Speech API
        </Typography>
      </Box>
    </Container>
  );
};

export default WelcomePage; 