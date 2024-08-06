import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from '@mui/material';
import {useTranslation} from "react-i18next";


const Hero4 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Box
            id="hero"
            sx={{
                position: "relative",
                pt: 4,
                pb: { xs: 8, md: 10 },
            }}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={0}
                    sx={{ flexDirection: { xs: "column", sm: "unset" } }}
                >
                    <Grid item xs={12} sm={12} md={8} lg={7}>
                        <Box
                            sx={{
                                textAlign: { xs: "center", md: "left" },
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Box sx={{ mb: { xs: 0, md: 3 }, fontFamily: "PT Sans" }}>
                                <Typography
                                    sx={{
                                        color: "primary.default",
                                        position: "relative",
                                        fontSize: { xs: 40, sm: 50, md: 60, lg: 72 },
                                        letterSpacing: 1.5,
                                        fontWeight: "bold",
                                        lineHeight: 1.3,
                                        textAlign: { xs: "center", md: "left" },
                                        mb: { xs: 2, md: 0 }
                                    }}
                                >
                                    Get{" "}
                                    <Typography
                                        component="mark"
                                        sx={{
                                            position: "relative",
                                            color: "primary.main",
                                            fontSize: "inherit",
                                            fontWeight: "inherit",
                                            backgroundColor: "unset",
                                        }}
                                    >
                                        ME{" "}
                                    </Typography>
                                    <br />
                                    In
                                    <Typography
                                        component="mark"
                                        sx={{
                                            position: "relative",
                                            color: "primary.main",
                                            fontSize: "inherit",
                                            fontWeight: "inherit",
                                            backgroundColor: "unset",
                                        }}
                                    >
                                        Vol
                                    </Typography>
                                    ved
                                    <br />
                                </Typography>
                                {mdDown && (
                                    <img
                                        src="/images/hero_people.svg"
                                        height={300}
                                        alt="Hero"
                                    />
                                )}
                            </Box>

                            <Box alignItems="center" sx={{ mt: { xs: 4, md: 0 }, mb: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
                                        textAlign: { xs: "center", md: "left" },
                                    }}
                                >
                                    {t("hero.find")}<br />
                                    {t("hero.post")}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    "& button": { mr: 2 },
                                    alignItems: { xs: "center", md: "left" },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        navigate("/events");
                                    }}
                                    sx={{
                                        background: "linear-gradient(45deg, #A1E8A1 30%, #5CBC63 90%)",
                                        borderRadius: '30px',
                                        border: '1px solid',
                                        borderColor: '#5CBC63',
                                    }}
                                >
                                    <Typography variant="h2" color="text.secondary" sx={{ letterSpacing: 3 }}>
                                        {t("hero.findButton")}
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        navigate("/create-event");
                                    }}
                                    sx={{
                                        background: "linear-gradient(45deg, #A1E8A1 30%, #5CBC63 90%)",
                                        borderRadius: '30px',
                                        border: '1px solid',
                                        borderColor: '#5CBC63',
                                    }}
                                >
                                    <Typography variant="h2" color="text.secondary" sx={{ letterSpacing: 3 }}>
                                        {t("hero.postButton")}
                                    </Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={0} sm={0} md={4} lg={5} sx={{ position: "relative" }}>
                        <Box sx={{ lineHeight: 0 }}>
                            {!mdDown && (
                                <img
                                    src="/images/hero_people.svg"
                                    width={"100%"}
                                    height={"100%"}
                                    alt="Hero"
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <br/>

            </Container>
        </Box>
    );
}

export default Hero4;