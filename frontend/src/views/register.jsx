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
  Collapse,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import FiberManualRecordTwoToneIcon from "@mui/icons-material/FiberManualRecordTwoTone";
import StopCircleTwoToneIcon from "@mui/icons-material/StopCircleTwoTone";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from "react-router-dom";

const Register = () => {
  const mediaRecorderRef = useRef(null);
  const [username, setUsername] = useState("");
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [openInstructions, setOpenInstructions] = useState(false);

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
      const response = await fetch("/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setToastSeverity("success");
        setToastMessage("User Registered Successfully :)");
      } else {
        setToastSeverity("error");
        setToastMessage(data.error || "Failed to register the user :(");
      }
      setOpenToast(true);
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

  const toggleInstructions = () => {
    setOpenInstructions(!openInstructions);
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
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          Enroll
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={toggleInstructions}
          onMouseEnter={() => setOpenInstructions(true)}
          onMouseLeave={() => setOpenInstructions(false)}
        >
          <Typography variant="body1" color="textPrimary">
            Say anything or 
          </Typography>
          <ExpandMoreIcon />
        </Box>

        <Collapse in={openInstructions}>
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              - The quick brown fox jumps over the lazy dog.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - How much wood would a woodchuck chuck if a woodchuck could chuck wood?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              - She sells seashells by the seashore.
            </Typography>
          </Box>
        </Collapse>

        <Grid container spacing={1} alignItems="center">
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
          Enroll
        </Button>

        <Typography variant="body1" sx={{ mt: 1 }}>
          Need to verify your voice? <Link to="/">Verify</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
