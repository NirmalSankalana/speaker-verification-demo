// Success.jsx
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, score } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Replace with the desired route
    }, 2000); // Redirect after 3 seconds (adjust as needed)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CheckCircleOutlineIcon
        sx={{
          color: 'green',
          fontSize: '5rem',
          animation: 'rotate 1s linear infinite',
          '@keyframes rotate': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Success!
      </Typography>
      {username && score && (
        <>
          <Typography variant="body1">Username: {username}</Typography>
          <Typography variant="body1">Score: {score}</Typography>
        </>
      )}
      <Typography variant="body1">Redirecting...</Typography>
      <CircularProgress size={24} sx={{ mt: 2 }} />
    </Box>
  );
};

export default Success;