import * as React from 'react';
import Box from '@mui/material/Box';
import Hero4 from '../components/LandingPage/Hero4';
import Pricing from '../components/LandingPage/Pricing';
import Testimonials from '../components/LandingPage/Testimonials';
import Contacts from "../components/LandingPage/Contacts";
import Footer from "../components/LandingPage/Footer"
import Features from "../components/LandingPage/Features"


export default function LandingPage() {
    return (
        <Box id="landing-page">
            <Hero4 />
            <Features/>
            <Testimonials />
            <Pricing />
            <Contacts />
            <Footer />
        </Box>
);
}