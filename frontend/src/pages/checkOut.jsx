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
                            pt: { xs: 4, sm: 12 },
                            pb: { xs: 8, sm: 16 },
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 3, sm: 6 },
                            borderRadius: '15px',
                            width: { xs: '80%', sm: '90%', md: '100%' },
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Switch
                                        checked={isYearlyPlan}
                                        onChange={handleSwitchChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        disabled={lockPlan}
                                    />
                                    <Typography sx={{ ml: 1 }}>
                                        {isYearlyPlan ? t("pricing.monthly") : t("pricing.yearly")}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            {items.map((item) => {
                                if (item.name === "Free") return null;

                                const yearlyPrice = (item.price * 12).toFixed(2);
                                const discountedYearlyPrice = (item.price * 12 * 0.95).toFixed(2);

                                return (
                                    <Grid
                                        item
                                        key={item.name}
                                        xs={12}
                                        sm={6}
                                        md={3}
                                    >
                                        <Card
                                            sx={{
                                                width: 250,
                                                height: 400,
                                                p: 2,
                                                backgroundColor: "#FCFCF6",
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        mb: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography component="h3" variant="h3">
                                                        {item.name}
                                                    </Typography>
                                                </Box>

                                                {item.price !== 0 && (
                                                    <>
                                                        {isYearlyPlan && item.name !== "Pay As You Go"? (
                                                            <>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'basedescriptionItem',
                                                                    }}
                                                                >
                                                                    <Typography component="h3" variant="h2" color="grey.400">
                                                                        <span style={{ textDecoration: 'line-through' }}>
                                                                            €{yearlyPrice}
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
                                                                        €{discountedYearlyPrice}
                                                                    </Typography>
                                                                    <Typography component="h3" variant="h6">
                                                                        &nbsp; {t("pricing.peryear")}
                                                                    </Typography>
                                                                </Box>
                                                                {item.price < item.basePrice &&
                                                                    <Typography component="text" variant="subtitle2">
                                                                        {t("pricing.sale")} {format(new Date(item.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
                                                                    </Typography>}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {item.price < item.basePrice ? (
                                                                    <>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'basedescriptionItem',
                                                                            }}
                                                                        >
                                                                            <Typography component="h3" variant="h2" color="grey.400">
                                                                                <span style={{ textDecoration: 'line-through' }}>
                                                                                    €{item.basePrice}
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
                                                                                €{item.price}
                                                                            </Typography>
                                                                            <Typography component="h3" variant="h6">
                                                                                &nbsp; {item.name === 'Pay As You Go' ? t("pricing.perevent") : t("pricing.permonth")}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Typography component="text" variant="subtitle2">
                                                                            {t("pricing.sale")} {format(new Date(item.isOnSaleUntil), 'yyyy-MM-dd HH:mm')}
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
                                                                                €{item.price}
                                                                            </Typography>
                                                                            <Typography component="h3" variant="h6">
                                                                                &nbsp; {item.name === 'Pay As You Go' ? t("pricing.perevent") : t("pricing.permonth")}
                                                                            </Typography>
                                                                        </Box>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                <Divider
                                                    sx={{
                                                        my: 2,
                                                        opacity: 0.2,
                                                        borderColor: 'grey.500',
                                                    }}
                                                />
                                                {item.description.map((descriptionItem) => (
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
                                            </CardContent>
                                            <CardActions>
                                                <Button fullWidth variant="contained" onClick={() => setBuyPlan(item)} disabled={lockPlan}>
                                                    {t("pricing.choose")}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
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
                        pt: { xs: 4, sm: 12 },
                        pb: { xs: 8, sm: 16 },
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 3, sm: 6 },
                        width: { xs: '80%', sm: '90%', md: '100%' },
                        mx: 'auto', // Center horizontally
                        px: { xs: 2, sm: 4 }, // Padding left and right
                    }}
                >
                    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: '15px', backgroundColor: "#FCFCF6", }}>
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
                                        <Typography component="span" variant="subtitle1" sx={{ ml: 1 }}>
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
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Typography component="text" variant="subtitle2" align="center">
                                    {t("pricing.price")}:
                                </Typography>
                                {getPrice()}
                                {chosenPlan.name === "Pay As You Go" && (
                                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} lockPlan={lockPlan}/>
                                )}
                                {user.data?.response?.subscriptionId && 
                                    <Alert severity="warning">
                                        You already have a subscription, please cancel it and then make your purchase!
                                    </Alert>
                                }
                                <Button variant="contained" color="primary" onClick={renderPayPalButton} sx={{ minWidth: 120 }}>
                                    {t("pricing.confirm")}
                                </Button>
                                {showPayPalButton && (
                                    <PayPalButton />
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
            <Pricing setBuyPlan={setBuyPlan} isYearlyPlan={isYearlyPlan} setIsYearlyPlan={setIsYearlyPlan} lockPlan={lockPlan}/>
            <Cart chosenPlan={chosenPlan} isYearlyPlan={isYearlyPlan} lockPlan={lockPlan} setLockPlan={setLockPlan}/>
        </Grid>
    )
}

export default CheckOut;
