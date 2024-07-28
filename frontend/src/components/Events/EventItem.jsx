import {
    Button,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    Typography, Snackbar,
} from "@mui/material";
import {Favorite, FavoriteBorder, MoreVert, Share} from "@mui/icons-material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {Link as RouterLink} from 'react-router-dom';
import dayjs from "dayjs";
import {useDeleteApplicationMutation} from "../../redux/applications/applicationApiSlice";
import {
    useAddWishlistItemMutation,
    useDeleteWishlistItemByEventMutation,
    useGetWishlistItemsForUserQuery
} from "../../redux/wishlist/wishlistApiSlice";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useDeleteEventMutation, useGetEventByIdQuery} from "../../redux/events/eventApiSlice";
import {styled} from "@mui/system";

const StyledButton = styled(Button)(({theme, variant}) => ({
    padding: '10px 20px',
    width: '80px',
    height: '50px',
    borderRadius: '15px',
    ...(variant === 'outlined' && {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.dark,
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

const EventItem = ({
                       eventID,
                       title,
                       date,
                       image,
                       type = "listing",
                       applicationStatus = "PENDING",
                       applicationID = null,
                   }) => {

    const [addWishList] = useAddWishlistItemMutation()
    const [deleteWishList] = useDeleteWishlistItemByEventMutation()
    const [deleteEvent] = useDeleteEventMutation()

    const volunteerID = useSelector(selectCurrentUserId)
    const [liked, setLiked] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const isUpcoming = new Date(date) > new Date();

    const {data: wishlistItems} = useGetWishlistItemsForUserQuery(volunteerID);
    const {data: event, isLoading, isSuccess, error} = useGetEventByIdQuery(eventID);

    useEffect(() => {
        if (wishlistItems && event) {
            const isEventInWishlist = wishlistItems.some(item => item.event && item.event._id === eventID);
            setLiked(isEventInWishlist);
        }
    }, [wishlistItems, eventID, event]);

    const [deleteApplication] = useDeleteApplicationMutation();
    const handleWithdraw = async (req, res) => {
        await deleteApplication(applicationID)
    }
    const handleWithdrawOrganiser = async (req, res) => {
        await deleteEvent(eventID)
    }
    const handleLike = async () => {
        try {
            if (liked) {
                await deleteWishList({userId: volunteerID, eventId: eventID});
                toast.success("Event is removed from your wish list.");
            } else {
                await addWishList({userId: volunteerID, eventId: eventID});
                toast.success("Event is added to your wish list.");
            }
            setLiked(!liked);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update your wish list.");
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return <ThumbUpOffAltIcon fontSize="small"/>;
            case 'DECLINED':
                return <ThumbDownOffAltIcon fontSize="small"/>;
            case 'PENDING':
                return <QuestionMarkIcon fontSize="small"/>;
            default:
                return null;
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleShareClick = () => {
        if (eventID) {
            const eventUrl = `${window.location.origin}/events/${eventID}`;
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

    const formatDate = (date) => {
        return dayjs(date).format('YYYY/MM/DD');
    };

    const formattedDate = formatDate(date);

    const dateString = `${formatDate(event?.response?.startDate)} - ${formatDate(event?.response?.endDate)}`

    return (
        <Card
            variant="outlined"
            sx={{
                position: 'relative',
                width: 400,
                height: 450,
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <CardMedia
                component="img"
                image={image}
                alt="Event image"
                sx={{height: 280, width: '100%', objectFit: 'cover'}}
            />
            <CardHeader
                title={title}
                subheader={dateString}
                titleTypographyProps={{sx: {variant: 'h2'}}}
            />
            <CardContent sx={{flexGrow: 1, pb: 0, pt: 0}}>
                {type === "my-events-volunteer-future" && (
                    <Typography variant="body2">
                        Your application status: {applicationStatus} {getStatusIcon(applicationStatus)}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                {type == "event-listing-volunteer" && (
                    <IconButton aria-label="share" onClick={handleShareClick} disabled={!isUpcoming}>
                        <Share/>
                    </IconButton>
                )}
                {type == "event-listing-volunteer" && (
                    <IconButton variant="outlined" color="neutral" sx={{mr: 'auto'}} onClick={handleLike}
                                disabled={!isUpcoming}>
                        {liked ? <Favorite/> : <FavoriteBorder/>}
                    </IconButton>
                )}
                {type == "my-events-volunteer-future" &&
                    <Button variant="outlined" onClick={handleWithdraw}>
                        Withdraw Application
                    </Button>
                }
                {type == "my-events-volunteer-draft" &&
                    <Button variant="outlined" onClick={handleWithdraw}>
                        Discard Draft
                    </Button>
                }
                {type == "my-events-volunteer-draft" &&
                    <Button variant="outlined" component={RouterLink} to={`/application/${eventID}/${applicationID}`}>
                        Edit Draft
                    </Button>
                }
                {type == "my-events-organiser-future" && (
                    <Button variant="outlined" onClick={handleWithdrawOrganiser}>
                        Withdraw
                    </Button>
                )}
                <Button variant="outlined" component={RouterLink} to={`/events/${eventID}`}>
                    View
                </Button>
                {type == "event-listing-volunteer" && (
                    <Button variant="outlined" component={RouterLink} to={`/application/${eventID}`}
                            disabled={!isUpcoming}>
                        Apply
                    </Button>
                )}
                {(type == "my-events-organiser-future" || type == "my-events-organiser") && (
                    <Button variant="outlined" component={RouterLink} to={`/events/management/${eventID}`}>
                        Manage
                    </Button>
                )}
            </CardActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Link copied"
            />
        </Card>
    );
};

export default EventItem;

