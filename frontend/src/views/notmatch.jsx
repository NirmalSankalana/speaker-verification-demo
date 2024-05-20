import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const NotMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || {};

  const handleTryAgain = () => {
    navigate('/');
  };

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
        Unsuccessful
      </Typography>
      {score !== undefined && (
        <Typography variant="body1" gutterBottom>
          Score: {score}
        </Typography>
      )}
      <Button
        variant="contained"
        color="error"
        onClick={handleTryAgain}
        sx={{ mt: 2 }}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default NotMatch;




// // NotMatch.jsx
// import React, { useEffect } from 'react';
// import { Box, Typography, CircularProgress } from '@mui/material';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import { useLocation, useNavigate } from 'react-router-dom';

// const NotMatch = () => {
//   const navigate = useNavigate();
//   const location = useLocation();


//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     navigate('/'); // Replace with the desired route
//   //   }, 2000); // Redirect after 3 seconds (adjust as needed)

//   //   return () => clearTimeout(timer);
//   // }, [navigate]);

//   const handleTryAgain = () => {
//     navigate('/');
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//       }}
//     >
//       <CancelOutlinedIcon
//         sx={{
//           color: 'red',
//           fontSize: '5rem',
//           animation: 'rotate 1s linear infinite',
//           '@keyframes rotate': {
//             '0%': {
//               transform: 'rotate(0deg)',
//             },
//             '100%': {
//               transform: 'rotate(360deg)',
//             },
//           },
//         }}
//       />
//       <Typography variant="h4" component="h1" gutterBottom>
//         Unsucessful
//       </Typography>
//       {score !== undefined && (
//         <Typography variant="body1" gutterBottom>
//           Similarity : {score}
//         </Typography>
//       )}
//       <Button
//         variant="contained"
//         color="error"
//         onClick={handleTryAgain}
//         sx={{ mt: 2 }}
//       >
//         Try Again
//       </Button>
//       {/* <Typography variant="body1">Redirecting...</Typography> */}
//       {/* <CircularProgress size={24} sx={{ mt: 2 }} /> */}
//     </Box>
//   );
// };

// export default NotMatch;