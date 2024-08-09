import * as React from 'react';
import Box from '@mui/material/Box';
import Hero from '../components/LandingPage/Hero';
import Pricing from '../components/LandingPage/Pricing';
import Testimonials from '../components/LandingPage/Testimonials';

import Footer from "../components/LandingPage/Footer"
import Features from "../components/LandingPage/Features"

export default function LandingPage() {
    return (
        <Box id="landing-page">
            <Hero />
            <Features/>
            <Testimonials />
            <Pricing />
            <Footer />
        </Box>
);
}