import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Snackbar,
    Alert,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog
} from '@mui/material';
import {
    useDeleteAllWishlistItemsForUserMutation,
    useGetWishlistItemsForUserQuery
} from '../redux/wishlist/wishlistApiSlice';
import WishlistItemCard3 from '../components/Wishlist/WishlistItemCard3';
import WishlistSearchBar from '../components/Wishlist/WishlistSearchBar';
import { ThemeProvider } from "@mui/material/styles";
import { volmeTheme } from "../theme";
import { selectCurrentUserId } from "../redux/auth/authSlice";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

const StyledButton = styled(Button)(({ theme, variant }) => ({
    padding: '10px 20px',
    width: '200px',  // Set a fixed width
    height: '50px',
    borderRadius: '30px',
    ...(variant === 'outlined' && {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            color: "white",
        },
    }),
    ...(variant === 'contained' && {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
}));

const WishlistPage = () => {
    const userId = useSelector(selectCurrentUserId);
    const { data: wishlistItems, error, isLoading } = useGetWishlistItemsForUserQuery(userId);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showExpiredNotification, setShowExpiredNotification] = useState(false);
    const [clearWishlist] = useDeleteAllWishlistItemsForUserMutation(userId);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (wishlistItems) {
            setFilteredItems(wishlistItems);
            const hasExpiredEvents = wishlistItems.some(item => new Date(item?.event?.startDate) <= new Date());
            setShowExpiredNotification(hasExpiredEvents);
        }
    }, [wishlistItems]);

    const handleSearch = () => {
        if (!searchTerm) {
            setFilteredItems(wishlistItems);
        } else {
            const newFilteredItems = wishlistItems?.filter(item =>
                item.event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(newFilteredItems || []);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredItems(wishlistItems); // Reset to show all items
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowExpiredNotification(false);
    };

    const handleClearWishlist = () => {
        setDialogOpen(true);
    };

    const handleConfirmClear = async () => {
        try {
            const { data } = await clearWishlist({ userId }).unwrap();
            setDialogOpen(false);
        } catch (error) {
            console.error('Failed to delete wishlist items:', error);
            setDialogOpen(false);
        }
    };

    const handleCancelClear = () => {
        setDialogOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const isWishlistEmpty = wishlistItems.length === 0;

    return (
        <ThemeProvider theme={volmeTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <Box sx={{ width: '70%', margin: '30px auto', marginLeft: '80px'  }}>
                    <Typography variant="h1" sx={{ marginBottom: 3 }}>{t("wishlist.myWishlist")}</Typography>
                    {wishlistItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>Your wishlist is empty</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ marginBottom: 2 }}>
                                <WishlistSearchBar
                                    items={wishlistItems}
                                    setFilteredItems={setFilteredItems}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    onSearchProp={handleSearch}
                                    onClearProp={handleClearSearch}
                                />
                            </Box>
                            <Grid container spacing={2}>
                                {filteredItems.map(item => (
                                    <Grid item key={item._id} xs={12} sm={6} md={6}>
                                        <WishlistItemCard3 item={item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    <Box sx={{ position: 'fixed', top: '250px', right: '70px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/events" style={{ textDecoration: 'none' }}>
                            <StyledButton variant="outlined" sx={{ marginRight: 2 }}>
                                {t("wishlist.backToAll")}
                            </StyledButton>
                        </Link>
                        {!isWishlistEmpty && (
                            <StyledButton
                                variant="outlined"
                                onClick={handleClearWishlist}
                            >
                                {t("wishlist.clearWishlist")}
                            </StyledButton>
                        )}
                    </Box>

                    <Snackbar
                        open={showExpiredNotification}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ mt: 10 }}
                    >
                        <Alert onClose={handleSnackbarClose} severity="warning">
                            Some events in your wishlist have expired!
                        </Alert>
                    </Snackbar>
                    <Dialog
                        open={dialogOpen}
                        onClose={handleCancelClear}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Clear Wish List"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to clear all items from your wishlist?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ paddingBottom: '24px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
                                <Button variant="outlined" color="primary" sx={{ fontWeight: 'bold', width: '100px' }} onClick={handleCancelClear}>
                                    Cancel
                                </Button>
                                <Button variant="outlined" color="primary" autoFocus sx={{ fontWeight: 'bold', width: '100px' }} onClick={handleConfirmClear}>
                                    Clear
                                </Button>
                            </Box>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default WishlistPage;
