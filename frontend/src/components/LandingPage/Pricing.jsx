import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {useGetPaymentItemsQuery} from "../../redux/payment/PaymentItemApiSlice";
import {format} from 'date-fns';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import useRole from "../../redux/auth/useRole";

const Pricing = () => {
    const {t} = useTranslation();
    const {data: items, isSuccess} = useGetPaymentItemsQuery();
    const {role} = useRole()

    const navigate = useNavigate();

    const handleChoosePlan = (item) => {
        navigate('/checkout', {state: {chosenPlan: item}});
    };

    const item1 = items?.find(item => item.name === 'Free');
    const item2 = items?.find(item => item.name === 'Basic');
    const item3 = items?.find(item => item.name === 'Premium');
    const item4 = items?.find(item => item.name === 'Pay As You Go');

    return (
        <>
            {isSuccess && (
                <Container
                    id="pricing"
                    sx={{
                        pt: {xs: 4, sm: 12},
                        pb: {xs: 8, sm: 16},
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: {xs: 3, sm: 6},
                        borderRadius: '15px',
                        width: {xs: '80%', sm: '90%', md: '100%'},
                    }}
                >
                    {role === 'ORGANIZER' && (<>
                        <Box
                            sx={{
                                textAlign: {sm: 'left', md: 'center'},
                            }}
                        >
                            <Typography
                                variant="h1"
                                color="text.primary"
                            >
                                {t("pricing.title")}
                            </Typography>
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{padding: '20px'}}
                            >
                                {t("pricing.description")}
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                key="item1"
                                xs={12}
                                sm={6}
                                md={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*免费*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 600,
                                        p: 2,
                                        backgroundColor: "#FCFCF6",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <CardContent sx={{flex: '1 1 auto'}}>
                                        <Box
                                            sx={{
                                                mb: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography component="h3" variant="h3">
                                                {t("pricing.item1_title")}
                                            </Typography>
                                        </Box>

                                        <Divider
                                            sx={{
                                                my: 2,
                                                opacity: 0.2,
                                                borderColor: 'grey.500',
                                            }}
                                        />
                                        {/*description1-1*/}
                                        <Box
                                            key="description1-1"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description1-1")}
                                            </Typography>
                                        </Box>
                                        {/*description1-2*/}
                                        <Box
                                            key="description1-2"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description1-2")}
                                            </Typography>
                                        </Box>
                                        {/*description1-3*/}
                                        <Box
                                            key="description1-3"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description1-3")}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid
                                item
                                key="item2"
                                xs={12}
                                sm={6}
                                md={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*订阅1*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 600,
                                        p: 2,
                                        backgroundColor: "#FCFCF6",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <CardContent sx={{flex: '1 1 auto'}}>
                                        <Box
                                            sx={{
                                                mb: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography component="h3" variant="h3">
                                                {t("pricing.item2_title")}
                                            </Typography>
                                        </Box>

                                        {/*更改价格组件*/}
                                        {item2.price < item2.basePrice ? (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2"
                                                                color="grey.400">
                                                                <span style={{textDecoration: 'line-through'}}>
                                                                    €{item2.basePrice}
                                                                </span>
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item2.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.permonth")}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    component="text"
                                                    variant="subtitle2"
                                                >
                                                    {t("pricing.sale")} {format(new Date(item2.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item2.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.permonth")}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}


                                        <Divider
                                            sx={{
                                                my: 2,
                                                opacity: 0.2,
                                                borderColor: 'grey.500',
                                            }}
                                        />
                                        {/*description2-1*/}
                                        <Box
                                            key="description2-1"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description2-1")}
                                            </Typography>
                                        </Box>
                                        {/*description2-2*/}
                                        <Box
                                            key="description2-2"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description2-2")}
                                            </Typography>
                                        </Box>
                                        {/*description2-3*/}
                                        <Box
                                            key="description2-3"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description2-3")}
                                            </Typography>
                                        </Box>
                                        {/*description2-4*/}
                                        <Box
                                            key="description2-4"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description2-4")}
                                            </Typography>
                                        </Box>
                                        {/*description2-5*/}
                                        <Box
                                            key="description2-5"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description2-5")}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{mt: 'auto'}}>
                                        <Button fullWidth variant="contained"
                                                onClick={() => handleChoosePlan(item2)}>
                                            {t("pricing.choose")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid
                                item
                                key="item3"
                                xs={12}
                                sm={6}
                                md={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*订阅2*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 600,
                                        p: 2,
                                        backgroundColor: "#FCFCF6",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <CardContent sx={{flex: '1 1 auto'}}>
                                        <Box
                                            sx={{
                                                mb: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography component="h3" variant="h3">
                                                {t("pricing.item3_title")}
                                            </Typography>
                                        </Box>

                                        {item3.price < item3.basePrice ? (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2"
                                                                color="grey.400">
                                                                <span style={{textDecoration: 'line-through'}}>
                                                                    €{item3.basePrice}
                                                                </span>
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item3.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.permonth")}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    component="text"
                                                    variant="subtitle2"
                                                >
                                                    {t("pricing.sale")} {format(new Date(item3.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item3.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.permonth")}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}


                                        <Divider
                                            sx={{
                                                my: 2,
                                                opacity: 0.2,
                                                borderColor: 'grey.500',
                                            }}
                                        />
                                        {/*description3-1*/}
                                        <Box
                                            key="description3-1"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-1")}
                                            </Typography>
                                        </Box>
                                        {/*description3-2*/}
                                        <Box
                                            key="description3-2"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-2")}
                                            </Typography>
                                        </Box>
                                        {/*description3-3*/}
                                        <Box
                                            key="description3-3"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-3")}
                                            </Typography>
                                        </Box>
                                        {/*description3-4*/}
                                        <Box
                                            key="description3-4"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-4")}
                                            </Typography>
                                        </Box>
                                        {/*description3-5*/}
                                        <Box
                                            key="description3-5"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-5")}
                                            </Typography>
                                        </Box>
                                        {/*description3-6*/}
                                        <Box
                                            key="description3-6"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-6")}
                                            </Typography>
                                        </Box>
                                        {/*description3-7*/}
                                        <Box
                                            key="description3-7"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-7")}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{mt: 'auto'}}>
                                        <Button fullWidth variant="contained"
                                                onClick={() => handleChoosePlan(item3)}>
                                            {t("pricing.choose")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid
                                item
                                key="item4"
                                xs={12}
                                sm={6}
                                md={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*一次性*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 600,
                                        p: 2,
                                        backgroundColor: "#FCFCF6",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <CardContent sx={{flex: '1 1 auto'}}>
                                        <Box
                                            sx={{
                                                mb: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography component="h3" variant="h3">
                                                {t("pricing.item4_title")}
                                            </Typography>
                                        </Box>

                                        {item4.price < item4.basePrice ? (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2"
                                                                color="grey.400">
                                                                <span style={{textDecoration: 'line-through'}}>
                                                                    €{item4.basePrice}
                                                                </span>
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item4.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.perevent")}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    component="text"
                                                    variant="subtitle2"
                                                >
                                                    {t("pricing.sale")} {format(new Date(item4.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2">
                                                        €{item4.price}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.perevent")}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}


                                        <Divider
                                            sx={{
                                                my: 2,
                                                opacity: 0.2,
                                                borderColor: 'grey.500',
                                            }}
                                        />
                                        {/*description4-1*/}
                                        <Box
                                            key="description4-1"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-1")}
                                            </Typography>
                                        </Box>
                                        {/*description4-3*/}
                                        <Box
                                            key="description4-3"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-3")}
                                            </Typography>
                                        </Box>
                                        {/*description4-4*/}
                                        <Box
                                            key="description4-4"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-4")}
                                            </Typography>
                                        </Box>
                                        {/*description4-5*/}
                                        <Box
                                            key="description4-5"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-5")}
                                            </Typography>
                                        </Box>
                                        {/*description4-6*/}
                                        <Box
                                            key="description4-6"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-6")}
                                            </Typography>
                                        </Box>
                                        {/*description4-7*/}
                                        <Box
                                            key="description4-7"
                                            sx={{
                                                py: 1,
                                                display: 'flex',
                                                gap: 1.5,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                component="text"
                                                variant="subtitle2"
                                            >
                                                {t("pricing.item1_description3-7")}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{mt: 'auto'}}>
                                        <Button fullWidth variant="contained"
                                                onClick={() => handleChoosePlan(item4)}>
                                            {t("pricing.choose")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </>)}
                </Container>
            )}
        </>
    );
};

export default Pricing;

