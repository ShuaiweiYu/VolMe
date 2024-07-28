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
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";

const Pricing = () => {
    const { t } = useTranslation();
    const { data: items, isSuccess } = useGetPaymentItemsQuery();
    const userId = useSelector(selectCurrentUserId);
    const {data: user, isSuccessUser, errorUser, isLoadingUser} = useGetUserByUserIdQuery(userId);

    const navigate = useNavigate(); // Initialize navigate function

    const handleChoosePlan = (item) => {
        // Redirect to checkout page with chosen plan
        navigate('/checkout', { state: { chosenPlan: item } });
    };

    return (
        <>
            {isSuccess && (
                <Container
                    id="pricing"
                    sx={{
                        pt: { xs: 4, sm: 12 },
                        pb: { xs: 8, sm: 16 },
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: { xs: 3, sm: 6 },
                        borderRadius: '15px',
                        width: { xs: '80%', sm: '90%', md: '100%' },
                    }}
                >
                    <Box
                        sx={{
                            textAlign: { sm: 'left', md: 'center' },
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
                            sx={{ padding: '20px' }}
                        >
                            {t("pricing.description")}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {items.map((item) => (
                            <Grid
                                item
                                key={item.name}
                                xs={12}
                                sm={6}
                                md={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Card
                                    sx={{
                                        width: 300,
                                        height: 400,
                                        p: 2,
                                        backgroundColor: "#FCFCF6",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <CardContent sx={{ flex: '1 1 auto' }}>
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
                                                        <Typography
                                                            component="text"
                                                            variant="subtitle2"
                                                        >
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
                                                                &nbsp; {item.name === 'Pay As You Go' ? 'per event' : 'per month'}
                                                            </Typography>
                                                        </Box>
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
                                                <Typography
                                                    component="text"
                                                    variant="subtitle2"
                                                >
                                                    {descriptionItem}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </CardContent>
                                    {(user?.response.role === 'ORGANIZER' && item.name !== "Free") &&
                                        <CardActions sx={{ mt: 'auto' }}>
                                            <Button fullWidth variant="contained" onClick={() => handleChoosePlan(item)}>
                                                {t("pricing.choose")}
                                            </Button>
                                        </CardActions>
                                    }
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}
        </>
    );
};

export default Pricing;

