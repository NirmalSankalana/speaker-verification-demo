import React, { useRef, useState } from "react";
import {
  Container,
  Box,
  IconButton,
  Button,
  Typography,
  TextField,
  Grid,
  Snackbar,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import FiberManualRecordTwoToneIcon from "@mui/icons-material/FiberManualRecordTwoTone";
import StopCircleTwoToneIcon from "@mui/icons-material/StopCircleTwoTone";
import { Link, useNavigate} from "react-router-dom";


const Home = () => {
  const mediaRecorderRef = useRef(null);
  const [username, setUsername] = useState("");
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const navigate = useNavigate();
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setRecordedBlob(blob);
      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const sendRecordedAudio = async () => {
    if (!recordedBlob) {
      setToastSeverity("error");
      setToastMessage("No recorded audio available");
      setOpenToast(true);
      return;
    }

    if (!username) {
      setToastSeverity("error");
      setToastMessage("No Username provided");
      setOpenToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("audio", recordedBlob, "recorded_audio.webm");
    formData.append("username", username);

    try {
      const response = await fetch("/verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Match Found') {
          setToastSeverity("success");
          setToastMessage("User Verified Successfully : " + data.username);
          setOpenToast(true);
          navigate('/success', { state: { username: data.username, score: data.score } });
        } else if (data.error === 'Match Not Found') {
          navigate('/not-match', { state: { score: data.score } }); // Navigate to the NotMatch component with score
        } else if (data.error === 'Audio is too short/empty') {
          setToastSeverity("warning");
          setToastMessage("Audio is too short/empty :(");
          setOpenToast(true);
        }
      } else {
        setToastSeverity("error");
        setToastMessage(data.error || "Failed to verify the user :(");
        setOpenToast(true);
      }
    } catch (error) {
      setToastSeverity("error");
      setToastMessage("Error uploading audio: " + error.message);
      setOpenToast(true);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  return (
      <Container component="main" maxWidth="xs">
        <Snackbar
        open={openToast} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseToast} severity={toastSeverity}>
            {toastMessage}
          </MuiAlert>
        </Snackbar>
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" >
          VerifyVoice
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="User Name"
          name="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item>
            <IconButton onClick={toggleRecording}>
              {isRecording ? (
                <StopCircleTwoToneIcon sx={{ color: "red", fontSize: "3rem" }} />
              ) : (
                <FiberManualRecordTwoToneIcon
                  sx={{ color: "red", fontSize: "3rem" }}
                />
              )}
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              {isRecording ? "Recording..." : "Record Audio"}
            </Typography>
          </Grid>
        </Grid>

        {recordedBlob && (
          <audio src={URL.createObjectURL(recordedBlob)} controls sx={{ mt: 1 }} />
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 1 }}
          onClick={sendRecordedAudio}
        >
          Verify
        </Button>

        <Typography variant="body1" sx={{ mt: 1 }}>
          Need to Register your voice? <Link to="/register">Enroll</Link>
        </Typography>


      </Box>
    </Container>
  );
};

export default Home;
