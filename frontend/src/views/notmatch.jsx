// NotMatch.jsx
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';

const NotMatch = () => {
  const navigate = useNavigate();

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
      <CancelOutlinedIcon
        sx={{
          color: 'red',
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
        Unsucessful
      </Typography>
      <Typography variant="body1">Redirecting...</Typography>
      <CircularProgress size={24} sx={{ mt: 2 }} />
    </Box>
  );
};

export default NotMatch;