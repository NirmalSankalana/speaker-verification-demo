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

  // Create a FormData object to send the data
  const formData = new FormData();
  formData.append('username', username);
  formData.append('audio', recordedAudio);

  // Send the POST request to the backend
  fetch('/users', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.ok) {
      setUsername('');
      setRecordedAudio(null);
      alert('Registration successful!');
    } else {
      throw new Error('Registration failed.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Registration failed. Please try again later.');
  });
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