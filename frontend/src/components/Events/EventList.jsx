import React, { useState } from 'react';
import { useGetEventsQuery } from "../../redux/events/eventApiSlice";
import {Box, Grid, Pagination, CircularProgress, Typography} from "@mui/material";
import EventItem from "./EventItem";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";


const EventList = ({ searchTerm, location, time ,language}) => {
    const [page, setPage] = useState(1);
    const userId = useSelector(selectCurrentUserId);
    const { data: user, isSuccessUser,errorUser, isLoadingUser } = useGetUserByUserIdQuery(userId);


    const {
        data: events,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetEventsQuery({ page: page, keyword: searchTerm, location: location, time: time ,language :language});

    const sortedEvents = events?.response?.events.slice().sort((a, b) => {
        const aType = a.response?.organiser?.subscriptionType !== 'FREE';
        const bType = b.response?.organiser?.subscriptionType !== 'FREE';
        if (aType !== bType) return bType - aType;
        return b.isSponsored - a.isSponsored;
    });

    return (
        <>
            <Grid container columns={12} spacing={{ xs: 1, md: 2 }}>
                {(isFetching || isLoading) ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100vh'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100vh'
                        }}
                    >
                        <Typography variant="h6" color="error">
                            {error?.data?.message || 'An error occurred while fetching events.'}
                        </Typography>
                    </Box>
                ) : isSuccess && (
                    <>
                        {sortedEvents.map((event, index) => (
                            <Grid item xs={12} md={6} key={index} display="flex" alignItems="center" justifyContent="center">
                                <EventItem
                                    eventID={event._id}
                                    title={event.title}
                                    date={event.startDate}
                                    image={getFileUrl(event.uploadURL[0], "image", "default")}
                                    description={event.description}
                                    promotion={event.isSponsored}
                                    type={user?.response.role === 'VOLUNTEER' ? 'event-listing-volunteer' : 'event-listing'}
                                />
                            </Grid>
                        ))}
                    </>
                )}
            </Grid>
            <Box display="flex" justifyContent="center">
                {isSuccess && <Pagination
                    sx={{ padding: 2 }}
                    count={events.response.pages}
                    page={page}
                    onChange={(event, value) => {
                        setPage(value);
                    }}
                    variant="outlined"
                    size="small"
                />}
            </Box>
        </>
    );
};

export default EventList;

