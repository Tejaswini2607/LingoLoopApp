const awsConfig = {
    Auth: {
      identityPoolId: 'ap-south-1:5159ac52-ae0e-495b-b9b1-2e416ad6b4d5', // From Cognito
      region: 'ap-south-1', 
      userPoolId: 'ap-south-1_foLEf6VSu',
      userPoolWebClientId: '5boob6o0i4m32lh2fahkl06hij'
    },
    Predictions: {
      convert: {
        // Speech to text configuration - AWS Transcribe
        transcription: {
          region: 'ap-south-1',
          proxy: false,
          defaults: {
            language: 'en-US'
          }
        },
        // Text to speech configuration - AWS Polly
        speechGenerator: {
          region: 'ap-south-1',
          proxy: false,
          defaults: {
            VoiceId: 'Joanna',
            LanguageCode: 'en-US'
          }
        }
      }
    }
  };
  
  export default awsConfig;