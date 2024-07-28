import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingComponent = ({noHeight}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: noHeight ? 'auto' : '100vh',
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingComponent;
