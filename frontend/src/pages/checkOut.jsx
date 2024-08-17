import Grid from "@mui/material/Grid";
import React, {useState} from 'react';
import {Button, TextField, Box, ButtonGroup, styled, Typography, CardActions, Switch, Alert} from '@mui/material';
import PayPalButton from "../components/payment/paypalButton";
import {useDispatch, useSelector} from "react-redux";
import {
    setAmount,
    setIsSubscribing,
    setIsYearlyPayment,
    setItemId
} from "../redux/payment/paymentSlice";
import {useGetPaymentItemsQuery} from "../redux/payment/PaymentItemApiSlice";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper"
import CardContent from "@mui/material/CardContent";
import {format} from "date-fns";
import Divider from "@mui/material/Divider";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import {selectCurrentUserId} from "../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../redux/users/usersApiSlice";

const QuantitySelector = ({quantity, setQuantity, lockPlan}) => {

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleChange = (event) => {
        const value = Math.max(1, Number(event.target.value));
        setQuantity(value);
    };

    const CustomTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            textAlign: 'center',
        },
        '& .MuiInputBase-input': {
            textAlign: 'center',
        },
        '& fieldset': {
            borderRadius: 0,
        },
    });

    return (
        <ButtonGroup variant="outlined">
            <Button onClick={handleDecrement} disabled={quantity <= 1 || lockPlan}>
                -
            </Button>
            <CustomTextField
                value={quantity}
                onChange={handleChange}
                inputProps={{min: 1, style: {textAlign: 'center', width: '20px', height: '20px'}}}
                variant="outlined"
                style={{maxWidth: '60px', padding: 0, margin: 0}}
            />
            <Button onClick={handleIncrement} disabled={lockPlan}>
                +
            </Button>
        </ButtonGroup>
    );
};

const Pricing = ({setBuyPlan, isYearlyPlan, setIsYearlyPlan, lockPlan}) => {
    const {data: items, isSuccess} = useGetPaymentItemsQuery()
    const {t} = useTranslation();

    const item1 = items?.find(item => item.name === 'Free');
    const item2 = items?.find(item => item.name === 'Basic');
    const item3 = items?.find(item => item.name === 'Premium');
    const item4 = items?.find(item => item.name === 'Pay As You Go');

    const getYearlyPrice = (price) => {
        return (price * 12).toFixed(2);
    }

    const getDiscountedYearlyPrice = (price) => {
        return (price * 12 * 0.8).toFixed(2);
    }

    const handleSwitchChange = (event) => {
        setIsYearlyPlan(event.target.checked);
    };

    return (
        <>
            {isSuccess && (
                <>
                    <Container
                        id="pricing"
                        sx={{
                            pt: {xs: 4, sm: 12},
                            pb: {xs: 8, sm: 16},
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: {xs: 3, sm: 6},
                            borderRadius: '15px',
                            width: {xs: '80%', sm: '90%', md: '100%'},
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Switch
                                        checked={isYearlyPlan}
                                        onChange={handleSwitchChange}
                                        inputProps={{'aria-label': 'controlled'}}
                                        disabled={lockPlan}
                                    />
                                    <Typography sx={{ml: 1}}>
                                        {isYearlyPlan ? t("pricing.monthly") : t("pricing.yearly")}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            <Grid
                                item
                                key="item2"
                                xs={12}
                                sm={6}
                                md={4}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*订阅1*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 400,
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

                                        {isYearlyPlan ? (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2" color="grey.400">
                                                                        <span style={{textDecoration: 'line-through'}}>
                                                                            €{getYearlyPrice(item2.price)}
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
                                                        €{getDiscountedYearlyPrice(item2.price)}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.peryear")}
                                                    </Typography>
                                                </Box>
                                                {item2.price < item2.basePrice &&
                                                    <Typography component="text" variant="subtitle2">
                                                        {t("pricing.sale")} {format(new Date(item2.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                    </Typography>}
                                            </>
                                        ) : (<>
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
                                        </>)}

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
                                    <CardActions>
                                        <Button fullWidth variant="contained" onClick={() => setBuyPlan(item2)}
                                                disabled={lockPlan}>
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
                                md={4}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*订阅2*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 400,
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

                                        {isYearlyPlan ? (
                                            <>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'basedescriptionItem',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h2" color="grey.400">
                                                                        <span style={{textDecoration: 'line-through'}}>
                                                                            €{getYearlyPrice(item3.price)}
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
                                                        €{getDiscountedYearlyPrice(item3.price)}
                                                    </Typography>
                                                    <Typography component="h3" variant="h6">
                                                        &nbsp; {t("pricing.peryear")}
                                                    </Typography>
                                                </Box>
                                                {item3.price < item3.basePrice &&
                                                    <Typography component="text" variant="subtitle2">
                                                        {t("pricing.sale")} {format(new Date(item3.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                    </Typography>}
                                            </>
                                        ) : (<>
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
                                        </>)}


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
                                    <CardActions>
                                        <Button fullWidth variant="contained" onClick={() => setBuyPlan(item3)}
                                                disabled={lockPlan}>
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
                                md={4}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {/*一次性*/}
                                <Card
                                    sx={{
                                        width: 500,
                                        minHeight: 400,
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
                                    <CardActions>
                                        <Button fullWidth variant="contained" onClick={() => setBuyPlan(item4)}
                                                disabled={lockPlan}>
                                            {t("pricing.choose")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </>
            )}
        </>
    );
}

const Cart = ({chosenPlan, isYearlyPlan, lockPlan, setLockPlan}) => {
    const [quantity, setQuantity] = useState(1);
    const [showPayPalButton, setShowPayPalButton] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const userId = useSelector(selectCurrentUserId);
    const user = useGetUserByUserIdQuery(userId)

    const getPrice = () => {
        let price;
        if (chosenPlan.name === "Pay As You Go") {
            price = chosenPlan.price * quantity;
        } else {
            if (!isYearlyPlan) {
                price = chosenPlan.price;
            } else {
                price = chosenPlan.price * 12 * 0.95;
            }
        }
        return price.toFixed(2);
    };

    const renderPayPalButton = async () => {
        if (chosenPlan._id === "6680e07a41e3db2fd15447b5") {
            await dispatch(setAmount({amount: quantity}));
            await dispatch(setIsSubscribing({isSubscribing: false}));
            await dispatch(setIsYearlyPayment({isYearlyPayment: false}));
            await dispatch(setItemId({itemId: "6680e07a41e3db2fd15447b5"}));
        } else {
            await dispatch(setAmount({amount: 0}));
            await dispatch(setIsSubscribing({isSubscribing: true}));
            await dispatch(setIsYearlyPayment({isYearlyPayment: isYearlyPlan}));
            await dispatch(setItemId({itemId: chosenPlan._id}));
        }
        setShowPayPalButton(true);
        setLockPlan(true);
    };

    return (
        <>
            {chosenPlan && (
                <Container
                    id="cart"
                    sx={{
                        pt: {xs: 4, sm: 12},
                        pb: {xs: 8, sm: 16},
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: {xs: 3, sm: 6},
                        width: {xs: '80%', sm: '90%', md: '100%'},
                        mx: 'auto', // Center horizontally
                        px: {xs: 2, sm: 4}, // Padding left and right
                    }}
                >
                    <Paper sx={{p: {xs: 2, sm: 4}, borderRadius: '15px', backgroundColor: "#FCFCF6",}}>
                        <Typography component="h2" variant="h2" align="center" gutterBottom>
                            {t("pricing.details")}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8}>
                                <Typography component="text" variant="subtitle">
                                    {t("pricing.choose")}:
                                </Typography>
                                <Typography component="h3" variant="h3">
                                    {chosenPlan.name}
                                    {chosenPlan.name !== "Pay As You Go" && (
                                        <Typography component="span" variant="subtitle1" sx={{ml: 1}}>
                                            ({isYearlyPlan ? "Yearly Plan" : "Monthly Plan"})
                                        </Typography>
                                    )}
                                </Typography>
                                <Typography component="text" variant="subtitle">
                                    {t("pricing.benefits")}:
                                </Typography>
                                {chosenPlan.description.map((descriptionItem) => (
                                    <Box
                                        key={descriptionItem}
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
                                        <Typography component="text" variant="subtitle2">
                                            {descriptionItem}
                                        </Typography>
                                    </Box>
                                ))}
                            </Grid>
                            <Grid item xs={12} sm={4}
                                  sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                                <Typography component="text" variant="subtitle2" align="center">
                                    {t("pricing.price")}:
                                </Typography>
                                {getPrice()}
                                {chosenPlan.name === "Pay As You Go" && (
                                    <QuantitySelector quantity={quantity} setQuantity={setQuantity}
                                                      lockPlan={lockPlan}/>
                                )}
                                {user.data?.response?.subscriptionId &&
                                    <Alert severity="warning">
                                        You already have a subscription, please cancel it and then make your purchase!
                                    </Alert>
                                }
                                <Button variant="contained" color="primary" onClick={renderPayPalButton}
                                        sx={{minWidth: 120}}>
                                    {t("pricing.confirm")}
                                </Button>
                                {showPayPalButton && (
                                    <PayPalButton/>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            )}
        </>
    );
};

const CheckOut = () => {
    const location = useLocation();
    const defaultPlan = location.state ? location.state.chosenPlan : null; // selected plan from landing page

    const [chosenPlan, setChosenPlan] = useState(defaultPlan);
    const [isYearlyPlan, setIsYearlyPlan] = useState(false);
    const [lockPlan, setLockPlan] = useState(false);

    const setBuyPlan = (item) => {
        setChosenPlan(item);
    };

    return (
        <Grid>
            <Pricing setBuyPlan={setBuyPlan} isYearlyPlan={isYearlyPlan} setIsYearlyPlan={setIsYearlyPlan}
                     lockPlan={lockPlan}/>
            <Cart chosenPlan={chosenPlan} isYearlyPlan={isYearlyPlan} lockPlan={lockPlan} setLockPlan={setLockPlan}/>
        </Grid>
    )
}

export default CheckOut;
