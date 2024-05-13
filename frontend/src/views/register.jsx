import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import AudioRecorder from '../components/recoder';

const Register = () => {
  const [username, setUsername] = useState('');
  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleRecordingComplete = (url) => {
    console.log("Recording completed:", url);
    setRecordedAudio(url);
  };

  const handleSubmit = () => {
    if (!username || !recordedAudio) {
      alert('Please enter a username and record audio before submitting.');
      return;
    }

    // Code to submit username and recorded audio for registration
    console.log(`Username: ${username}`);
    console.log(`Recorded Audio URL:`, recordedAudio);

    // You can send this data to your backend for further processing
    // Example: fetch('/api/register', {
    //   method: 'POST',
    //   body: formData,
    // }).then(response => {
    //   // Handle response
    // });

    // Reset form after submission
    setUsername('');
    setRecordedAudio(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
        fullWidth
        margin="normal"
      />
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default Register;