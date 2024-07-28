import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";

// Import local logo images
import GoogleLogo from './logo/google_logo.png';
import AmazonLogo from './logo/amazon_logo.png';
import TUMLogo from './logo/tum_logo.png';
import MetaLogo from './logo/meta_logo.png';

const logoStyle = {
    height: '24px',
};

const bottomContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    marginTop: 'auto', // Push to the bottom of the card
};

export default function Testimonials() {
    const { t } = useTranslation();

    const userTestimonials = [
        {
            avatar: <Avatar alt="Emily Harrison" src="/images/profile/emily_harrison.webp" sx={{ width: 64, height: 64 }} />,
            name: 'Emily Harrison',
            occupation: t("testimonials.t1O"),
            testimonial:t("testimonials.t1T"),
        },
        {
            avatar: <Avatar alt="Brad Hudson" src="/images/profile/brad_hudson.webp" sx={{ width: 64, height: 64 }} />,
            name: 'Brad Hudson',
            occupation: t("testimonials.t2O"),
            testimonial: t("testimonials.t2T"),
        },
        {
            avatar: <Avatar alt="Alice Gabby" src="/images/profile/alice_gabby.jpg" sx={{ width: 64, height: 64 }} />,
            name: 'Alice Gabby',
            occupation: t("testimonials.t3O"),
            testimonial: t("testimonials.t3T"),
        },
        {
            avatar: <Avatar alt="Lucy Wu" src="/images/profile/lucy_wu.webp" sx={{ width: 64, height: 64 }} />,
            name: 'Lucy Wu',
            occupation: t("testimonials.t4O"),
            testimonial: t("testimonials.t4T"),
        },
    ];

    const logos = [
        GoogleLogo,
        AmazonLogo,
        TUMLogo,
        MetaLogo,
    ];

    return (
        <Container
            id="testimonials"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Box
                sx={{
                    width: { sm: '100%', md: '60%' },
                    textAlign: { sm: 'left', md: 'center' },
                }}
            >
                <Typography
                    variant="h1"
                    color="text.primary"
                >
                    {t("testimonials.title")}
                </Typography>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ padding: '20px' }}
                >
                    {t("testimonials.subTitle1")}<br/>
                    {t("testimonials.subTitle2")}<br/>
                    {t("testimonials.subTitle3")}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {userTestimonials.map((testimonial, index) => (
                    <Grid item xs={12} sm={6} key={index} sx={{ display: 'flex' }}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexGrow: 1,
                                p: 1,
                                width: '100%',
                                height: '100%',
                                borderRadius: '15px',
                                position: 'relative',
                                backgroundColor: "#FCFCF6",
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {testimonial.testimonial}
                                </Typography>
                            </CardContent>
                            <Box sx={bottomContainerStyle}>
                                <CardHeader
                                    avatar={testimonial.avatar}
                                    title={testimonial.name}
                                    subheader={testimonial.occupation}
                                />
                                <img
                                    src={logos[index]}
                                    alt={`Logo ${index + 1}`}
                                    style={logoStyle}
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}



