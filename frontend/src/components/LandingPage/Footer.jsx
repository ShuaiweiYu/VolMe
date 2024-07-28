import React from 'react'
import Box from '@mui/material/Box';
import {Typography} from "@mui/material";

const Footer = () => (
    <Box>
    <Box
        sx={{
            padding: '20px 40px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
        }}
    >
        <Typography sx={{ color: "text.secondary" }}>
            VolME® all rights reserved.
        </Typography>
    </Box>

    <Box
        sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: "#5CBC63",
            color: "white",
            paddingRight: { xs: '10px', sm: '40px' },
        }}
    >
        <Typography
            sx={{
                fontSize: '0.8rem',
                opacity: 0.7,
            }}
        >
            &copy; VolME {new Date().getFullYear()}
        </Typography>
    </Box>
    </Box>
)

export default Footer