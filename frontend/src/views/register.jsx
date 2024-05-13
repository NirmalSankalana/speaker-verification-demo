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

const Register = () => {
  const mediaRecorderRef = useRef(null);
  const [username, setUsername] = useState("");
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

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

    const formData = new FormData();
    formData.append("audio", recordedBlob, "recorded_audio.webm");
    formData.append("username", username);

    try {
      const response = await fetch("/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setToastSeverity("success");
        setToastMessage("User Registerd Successfully :)");
        setOpenToast(true);
        console.log("Audio uploaded successfully");
      } else {
        setToastSeverity("error");
        setToastMessage("Failsed to register the user :(");
        setOpenToast(true);
        console.error("Failed to upload audio");
      }
    } catch (error) {
      setToastSeverity("error");
      setToastMessage("Error uploading audio: " + error.message);
      setOpenToast(true);
      console.error("Error uploading audio:", error);
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Register
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

        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
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
          <audio src={URL.createObjectURL(recordedBlob)} controls sx={{ mt: 2 }} />
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          onClick={sendRecordedAudio}
        >
          Register
        </Button>

        <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseToast} severity={toastSeverity}>
            {toastMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Register;
