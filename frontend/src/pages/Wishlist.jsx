import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
    Dialog, IconButton
} from '@mui/material';
import {
    useDeleteAllWishlistItemsForUserMutation,
    useGetWishlistItemsForUserQuery
} from '../redux/wishlist/wishlistApiSlice';
import WishlistItemCard from '../components/Wishlist/WishlistItemCard';
import WishlistSearchBar from '../components/Wishlist/WishlistSearchBar';
import { ThemeProvider } from "@mui/material/styles";
import { volmeTheme } from "../theme";
import { selectCurrentUserId } from "../redux/auth/authSlice";
import { useTranslation } from "react-i18next";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoadingComponent from "../components/LoadingComponent";
import ErrorComponent from "../components/ErrorComponent";

const WishlistPage = () => {
    const userId = useSelector(selectCurrentUserId);
    const { data: wishlistItems, error, isLoading } = useGetWishlistItemsForUserQuery(userId);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
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
        return <LoadingComponent/>;
    }

    if (error) {
        return <ErrorComponent message={error.message} />
    }

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
                        <Grid container spacing={1}>
                            <Grid item xs={10}>
                                <WishlistSearchBar
                                    items={wishlistItems}
                                    setFilteredItems={setFilteredItems}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    onSearchProp={handleSearch}
                                    onClearProp={handleClearSearch}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton
                                    onClick={handleClearWishlist}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    <DeleteForeverIcon sx={{ width: 30, height: 30 }}/>
                                </IconButton>
                            </Grid>
                        </Grid>

                            <Grid container spacing={2}>
                                {filteredItems.map(item => (
                                    <Grid item key={item._id} xs={12}>
                                        <WishlistItemCard item={item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

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
