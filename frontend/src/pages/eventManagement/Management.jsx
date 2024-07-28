import {Avatar, Box, Button, Container, Divider, Link, Stack, TextField, Typography} from "@mui/material";
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import React, {useState} from "react";
import ImageWindow from "../../components/EventPage/ImageWindow";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetEventByIdQuery} from "../../redux/events/eventApiSlice";
import ApplicationManagement from "./ApplicationManagement";
import dayjs from "dayjs";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import ChatPopupButton from "../../components/Chat/ChatPopupButton";
import Grid from "@mui/material/Grid";

export const Management = () => {
    const { eventID } = useParams();
    const {data: event, isLoading, isSuccess, error, refetch} = useGetEventByIdQuery(eventID);
    if (isSuccess) {
        console.log(event)
    }
    const organiserID = event?.response?.organiser;
    const {data: organiser} = useGetUserByUserIdQuery(organiserID, {skip: !organiserID});
    const navigate = useNavigate();


    const userID = useSelector(selectCurrentUserId);
    const {data: user} = useGetUserByUserIdQuery(userID, {skip: !userID});

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');


    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };

    const handleButtonClick = () => {
        navigate(`/application/${eventID}`);
    };


    if (error) {
        return <Typography color="error">Error loading event</Typography>;
    }

    const handleAvatarError = (event) => {
        event.target.src = '/path/to/default/image';
    };


    return (
        <Container id="event-management" sx={{width: '80%', margin: '30px auto', fontFamily: 'Arial, sans-serif'}}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={4}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            //boxShadow: 5,
                            backdropFilter: 'blur(24px)',
                            borderRadius: '15px',
                            border: '1px solid',
                            borderColor: 'divider',
                            padding: '10px',
                        }}
                    >

                        <Typography variant="h2" textAlign="center">{event?.response.title}</Typography>
                        <Stack sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left'}}>
                            {event && (
                                <>
                                    <Box sx={{textAlign: 'center', marginBottom: '20px'}}>
                                        <ImageWindow uploadURL={event?.response.uploadURL}/>
                                    </Box>

                                    <Typography variant="h3">Date</Typography>
                                    <Typography>Start Date: {dayjs(event?.response.startDate).format('YYYY-MM-DD HH:mm')}</Typography>
                                    <Typography>End Date: {dayjs(event?.response.endDate).format('YYYY-MM-DD HH:mm')}</Typography>

                                    <Divider sx={{ margin: '10px 0' }} />
                                    <Typography variant="h3">Place</Typography>
                                    <Typography>
                                        {`${event?.response.address} ${event?.response.houseNumber}, ${event?.response.zipCode} ${event?.response.selectedCity.name},
                                    ${event?.response.selectedState.name}, ${event?.response.selectedCountry.name}`}
                                    </Typography>
                                    <Divider sx={{margin: '10px 0'}}/>
                                </>
                            )}
                        </Stack>
                        <Typography variant="h3">Organized by</Typography>
                        {event ? (
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Avatar
                                        src={getFileUrl(event?.response.organiser.profilePicturePath, "icon", "default")}
                                        onError={handleAvatarError}
                                        sx={{borderRadius: '50%', margin: '10px 0', marginRight: '10px', width: 70, height: 70}}
                                    >
                                        <PersonIcon/>
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{event?.response.organiser.username}</Typography>
                                    </Box>
                                    <ChatPopupButton receiverId={event?.response.organiser._id}/>
                                </Box>
                            </Stack>
                        ) : (
                            <Avatar>
                                <PersonIcon/>
                            </Avatar>
                        )}
                        <Button variant="outlined" component={RouterLink} to={`/events/${eventID}`}>
                            View Details in Event Page
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                    {isSuccess && <ApplicationManagement eventId={eventID} eventObj={event?.response}></ApplicationManagement>}
                </Grid>
            </Grid>
        </Container>

    )
}