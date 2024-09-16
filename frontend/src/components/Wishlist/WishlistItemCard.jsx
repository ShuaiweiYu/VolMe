import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    CardActions,
    IconButton,
    Typography,
    Button,
    Box,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { Share, Close } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { useDeleteWishlistItemForUserMutation } from '../../redux/wishlist/wishlistApiSlice';
import { useGetUserByUserIdQuery } from '../../redux/users/usersApiSlice';
import {getFileUrl} from "../../util/fileUploaderWrapper";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {closeWishlistDrawer} from "../../redux/wishlist/wishlistSlice";
import CS from "../../pages/events/image/CS.jpg";
import EL from "../../pages/events/image/EL.jpg";
import EC from "../../pages/events/image/EC.jpg";
import HM from "../../pages/events/image/HM.jpg";
import AW from "../../pages/events/image/AW.jpg";
import AC from "../../pages/events/image/AC.jpg";
import DR from "../../pages/events/image/DR.jpg";
import YC from "../../pages/events/image/OT.jpg";
import SE from "../../pages/events/image/SE.jpg";
import SR from "../../pages/events/image/SR.jpg";
import HR from "../../pages/events/image/HR.jpg";
import SJ from "../../pages/events/image/SJ.jpg";
import HH from "../../pages/events/image/HH.jpg";
import HF from "../../pages/events/image/HF.jpg";
import MH from "../../pages/events/image/MH.jpg";
import IV from "../../pages/events/image/IV.jpg";
import CI from "../../pages/events/image/CI.jpg";
import OT from "../../pages/events/image/OT.jpg";

const WishlistItemCard = ({ item, onDelete, isSelected, onSelectChange }) => {
    const [deleteWishlistItemForUser, { isLoading: deleteLoading, isError: deleteError }] = useDeleteWishlistItemForUserMutation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const images = [
        {key: "CS", value: CS},
        {key: "EL", value: EL},
        {key: "EC", value: EC},
        {key: "HM", value: HM},
        {key: "AW", value: AW},
        {key: "AC", value: AC},
        {key: "DR", value: DR},
        {key: "YC", value: YC},
        {key: "SE", value: SE},
        {key: "SR", value: SR},
        {key: "HR", value: HR},
        {key: "SJ", value: SJ},
        {key: "HH", value: HH},
        {key: "HF", value: HF},
        {key: "MH", value: MH},
        {key: "IV", value: IV},
        {key: "CI", value: CI},
        {key: "OT", value: OT}
    ];

    const { data: user, isLoading: userLoading, isError: userError } = useGetUserByUserIdQuery(item?.event?.organiser);

    const handleToEventClick = async () => {
        await dispatch(closeWishlistDrawer())
    };

    const handleApplyNowClick = async () => {
        await dispatch(closeWishlistDrawer())
    };

    const handleShareClick = () => {
        if (item?.event) {
            const eventUrl = `${window.location.origin}/events/${item?.event?._id}`;

            navigator.clipboard.writeText(eventUrl)
                .then(() => {
                    setSnackbarOpen(true);
                })
                .catch(err => {
                    console.error('Failed to copy URL to clipboard:', err);
                });
        } else {
            console.error('Cannot share: Event details undefined');
        }
    };

    const handleDeleteItemClick = () => {
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        const userId = item.user._id;

        try {
            const { data } = await deleteWishlistItemForUser({ userId, wishlistItemId: item._id }).unwrap();
            if (onDelete) {
                onDelete(item._id);
            }
            setDialogOpen(false);
        } catch (error) {
            console.error('Failed to delete wishlist item:', error);
            setDialogOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setDialogOpen(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const isUpcoming = new Date(item?.event?.startDate) > new Date();

    return (
        <Card sx={{ maxWidth: 500, margin: 5, position: 'relative', borderRadius: '15px' }}>
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', zIndex: 1 }}>
                <IconButton
                    aria-label="delete"
                    onClick={handleDeleteItemClick}
                    sx={{ backgroundColor: 'lightgray', padding: 0.5, borderRadius: '15px', '&:hover': { backgroundColor: 'gray' } }}
                    size="small"
                >
                    <Close fontSize="small" />
                </IconButton>
            </Box>
            <CardMedia
                component="img"
                height="50%"
                image={item?.event?.uploadURL.length !== 0 ? getFileUrl(item?.event?.uploadURL[0], "image", "default") : images.find(img => img.key === item?.event?.category)?.value}
                alt="Event image"
                sx={{ height: 300, filter: !isUpcoming ? 'grayscale(100%)' : 'none' }} // Apply grayscale filter if not upcoming
            />
            <CardContent sx={{ height: 100 }}>
                <Typography variant="h6" sx={{ color: !isUpcoming ? 'lightgray' : 'black' }}>
                    {item?.event ? item?.event?.title : 'Event Title'} {!isUpcoming && <span>(Expired)</span>}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: !isUpcoming ? 'lightgray' : 'grey' }}>
                    <strong>{t("wishlistItemCard.organizer")}:</strong> {user ? user.response.username : 'Organiser not specified'}<br />
                    <strong>{t("wishlistItemCard.startDate")}:</strong> {item?.event ? (
                    item?.event?.startDate ? (
                        <>
                            {new Date(item?.event?.startDate).toLocaleDateString()}{' '}
                            {new Date(item?.event?.startDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </>
                    ) : 'Date not specified'
                ) : 'Event not specified'}<br />
                    <strong>{t("wishlistItemCard.endDate")}:</strong> {item?.event ? (
                    item?.event?.startDate ? (
                        <>
                            {new Date(item?.event?.endDate).toLocaleDateString()}{' '}
                            {new Date(item?.event?.endDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </>
                    ) : 'Date not specified'
                ) : 'Event not specified'}<br />
                    <strong>{t("wishlistItemCard.location")}:</strong> {item?.event ? (`${item?.event?.address} ${item?.event?.houseNumber}, ${item?.event?.zipCode} ${item?.event?.selectedCity?.name},
        ${item?.event?.selectedState?.name}, ${item?.event?.selectedCountry?.name}` || 'Location not specified') : 'Event not specified'}<br />
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                <IconButton aria-label="share" onClick={handleShareClick} disabled={!isUpcoming}>
                    <Share />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {item?.event && (
                        <>
                            <Button variant="outlined" component={Link} to={`/events/${item?.event?._id}`}
                                    onClick={handleToEventClick} disabled={!isUpcoming}>
                                {t("wishlistItemCard.toEvent")}
                            </Button>
                            <Button variant="outlined" component={Link} to={`/application/${item?.event?._id}`}
                                    onClick={handleApplyNowClick} disabled={!isUpcoming}>
                                {t("wishlistItemCard.applyNow")}
                            </Button>
                        </>
                    )}
                </Box>
            </CardActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Link copied"
            />
            <Dialog
                open={dialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Remove from wish list"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this from your wishlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '24px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
                        <Button variant="outlined" color="primary" sx={{ fontWeight: 'bold', width: '100px' }}  onClick={handleCancelDelete}>
                            Close
                        </Button>
                        <Button variant="outlined" color="primary" autoFocus sx={{ fontWeight: 'bold', width: '100px' }}  onClick={handleConfirmDelete}>
                            Remove
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default WishlistItemCard;
