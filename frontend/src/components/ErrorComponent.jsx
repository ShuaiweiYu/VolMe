import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ErrorComponent = ({ message, noHeight }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: noHeight ? 'auto' : '100vh',
                textAlign: 'center'
            }}
        >
            <Alert severity="error">
                <AlertTitle>An error occurred!</AlertTitle>
                <Typography variant="body1">{message}</Typography>
            </Alert>
        </Box>
    );
};

export default ErrorComponent;
