import React from 'react';
import {useMediaQuery, Card, CardContent, Typography, Box, Container, Grid, ThemeProvider, styled} from '@mui/material';
import {volmeTheme} from '../../theme';
import {useTranslation} from 'react-i18next';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import StarsIcon from '@mui/icons-material/Stars';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const StyledCard = styled(Card)(({theme}) => ({
    borderRadius: '15px',
    boxShadow: theme.shadows[3],
    minHeight: '250px',
    minWidth: '200px',
    backgroundColor: '#FCFCF6',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
}));

const Features = () => {
    const {t} = useTranslation();
    const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const benefitsVolunteer = [
        {
            title: t('features.bVTitle1'),
            description: t('features.bVDescription1'),
            icon: <EventIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
        {
            title: t('features.bVTitle2'),
            description: t('features.bVDescription2'),
            icon: <PeopleIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
        {
            title: t('features.bVTitle3'),
            description: t('features.bVDescription3'),
            icon: <FavoriteIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
    ];

    const benefitsOrganiser = [
        {
            title: t('features.bOTitle1'),
            description: t('features.bODescription1'),
            icon: <EventAvailableIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
        {
            title: t('features.bOTitle2'),
            description: t('features.bODescription2'),
            icon: <VolunteerActivismIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
        {
            title: t('features.bOTitle3'),
            description: t('features.bODescription3'),
            icon: <StarsIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
        },
    ];

    // const benefitsCompany = [
    //     {
    //         title: t('features.bCTitle1'),
    //         description: t('features.bCDescription1'),
    //         icon: <VisibilityIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
    //     },
    //     {
    //         title: t('features.bCTitle2'),
    //         description: t('features.bCDescription2'),
    //         icon: <PeopleAltIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
    //     },
    //     {
    //         title: t('features.bCTitle3'),
    //         description: t('features.bCDescription3'),
    //         icon: <ThumbUpAltIcon sx={{fontSize: 40}} style={{color: '#5CBC63'}}/>,
    //     },
    // ];

    return (
        <ThemeProvider theme={volmeTheme}>
            <Box sx={{textAlign: {sm: 'left', md: 'center'}}}>
                <Typography variant="h1" color="text.primary">
                    {t('features.title')}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{padding: '20px'}}>
                    {t('features.subTitle')}
                </Typography>

                <Container
                    id="features"
                    sx={{
                        pt: {xs: 4, sm: 12},
                        pb: {xs: 8, sm: 16},
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: {xs: 3, sm: 6},
                    }}
                >
                    <Grid container spacing={2} sx={{flexDirection: {xs: 'column', sm: 'unset'}}}>
                        <Grid item xs={12} sm={12} md={8} lg={7}>
                            <Box
                                sx={{
                                    textAlign: {xs: 'center', md: 'left'},
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    color="text.primary"
                                    sx={{
                                        fontSize: 30,
                                        fontWeight: 'regular',
                                        position: 'relative',
                                        textAlign: {xs: 'center', md: 'left'},
                                    }}
                                >
                                    {t('features.for')}
                                    <Typography
                                        component="span"
                                        color="text.primary"
                                        sx={{fontSize: 30, fontWeight: 'bold', display: 'inline'}}
                                    >
                                        {t('features.v')}
                                    </Typography>
                                </Typography>

                                <Grid container spacing={2} sx={{mt: 2}}>
                                    {benefitsVolunteer.map((benefit, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <StyledCard>
                                                <CardContent sx={{display: 'flex', alignItems: 'center'}}>
                                                    {benefit.icon}
                                                    <Box sx={{ml: 2}}>
                                                        <Typography variant="h6" component="div">
                                                            {benefit.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {benefit.description}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>

                                {mdDown && (
                                    <img src="/images/hero_team.svg" height={300} alt="Hero img"/>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={0} sm={0} md={4} lg={5} sx={{position: 'relative'}}>
                            <Box sx={{lineHeight: 0}}>
                                {!mdDown && (
                                    <img src="/images/hero_team.svg" width="100%" height="100%" alt="Hero img"/>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{flexDirection: {xs: 'column', sm: 'unset'}}}>
                        <Grid item xs={0} sm={0} md={4} lg={5} sx={{position: 'relative'}}>
                            <Box sx={{lineHeight: 0}}>
                                {!mdDown && (
                                    <img src="/images/hero.svg" width="100%" height="100%" alt="Hero img"/>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={8} lg={7}>
                            <Box
                                sx={{
                                    textAlign: {xs: 'center', md: 'left'},
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    color="text.primary"
                                    sx={{
                                        fontSize: 30,
                                        fontWeight: 'regular',
                                        position: 'relative',
                                        textAlign: {xs: 'center', md: 'left'},
                                        ml: {xs: 0, sm: 5, md: 10},
                                    }}
                                >
                                    {t('features.for')}
                                    <Typography
                                        component="span"
                                        color="text.primary"
                                        sx={{fontSize: 30, fontWeight: 'bold', display: 'inline'}}
                                    >
                                        {t('features.o')}
                                    </Typography>
                                </Typography>

                                <Grid container spacing={2} sx={{mt: 2, ml: {xs: 0, sm: 5, md: 10}}}>
                                    {benefitsOrganiser.map((benefit, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <StyledCard>
                                                <CardContent sx={{display: 'flex', alignItems: 'center'}}>
                                                    {benefit.icon}
                                                    <Box sx={{ml: 2}}>
                                                        <Typography variant="h6" component="div">
                                                            {benefit.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {benefit.description}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>

                                {mdDown && (
                                    <img src="/images/hero_team.svg" height={300} alt="Hero img"/>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    {/*<Grid container spacing={2} sx={{flexDirection: {xs: 'column', sm: 'unset'}}}>*/}
                    {/*    <Grid item xs={12} sm={12} md={8} lg={7}>*/}
                    {/*        <Box*/}
                    {/*            sx={{*/}
                    {/*                textAlign: {xs: 'center', md: 'left'},*/}
                    {/*                height: '100%',*/}
                    {/*                display: 'flex',*/}
                    {/*                flexDirection: 'column',*/}
                    {/*                justifyContent: 'center',*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <Typography*/}
                    {/*                color="text.primary"*/}
                    {/*                sx={{*/}
                    {/*                    fontSize: 30,*/}
                    {/*                    fontWeight: 'regular',*/}
                    {/*                    position: 'relative',*/}
                    {/*                    textAlign: {xs: 'center', md: 'left'},*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                {t('features.for')}*/}
                    {/*                <Typography*/}
                    {/*                    component="span"*/}
                    {/*                    color="text.primary"*/}
                    {/*                    sx={{fontSize: 30, fontWeight: 'bold', display: 'inline'}}*/}
                    {/*                >*/}
                    {/*                    {t('features.c')}*/}
                    {/*                </Typography>*/}
                    {/*            </Typography>*/}

                    {/*            <Grid container spacing={2} sx={{mt: 2}}>*/}
                    {/*                {benefitsCompany.map((benefit, index) => (*/}
                    {/*                    <Grid item xs={12} sm={6} md={4} key={index}>*/}
                    {/*                        <StyledCard>*/}
                    {/*                            <CardContent sx={{display: 'flex', alignItems: 'center'}}>*/}
                    {/*                                {benefit.icon}*/}
                    {/*                                <Box sx={{ml: 2}}>*/}
                    {/*                                    <Typography variant="h6" component="div">*/}
                    {/*                                        {benefit.title}*/}
                    {/*                                    </Typography>*/}
                    {/*                                    <Typography variant="body2" color="text.secondary">*/}
                    {/*                                        {benefit.description}*/}
                    {/*                                    </Typography>*/}
                    {/*                                </Box>*/}
                    {/*                            </CardContent>*/}
                    {/*                        </StyledCard>*/}
                    {/*                    </Grid>*/}
                    {/*                ))}*/}
                    {/*            </Grid>*/}

                    {/*            {mdDown && (*/}
                    {/*                <img src="/images/hero_company.svg" height={300} alt="Hero img"/>*/}
                    {/*            )}*/}
                    {/*        </Box>*/}
                    {/*    </Grid>*/}

                    {/*    <Grid item xs={0} sm={0} md={4} lg={5} sx={{position: 'relative'}}>*/}
                    {/*        <Box sx={{lineHeight: 0}}>*/}
                    {/*            {!mdDown && (*/}
                    {/*                <img src="/images/hero_company.svg" width="100%" height="100%" alt="Hero img"/>*/}
                    {/*            )}*/}
                    {/*        </Box>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Features;



