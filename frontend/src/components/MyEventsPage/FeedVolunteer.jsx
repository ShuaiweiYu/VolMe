import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../redux/auth/authSlice";
import { useGetApplicationsByVolunteerQuery } from "../../redux/applications/applicationApiSlice";
import HighlightCalendar from "../../components/MyEventsPage/HighlightCalendar";
import EventItem from "../../pages/events/EventItem";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import defaultEventImg from "../../Assets/defaultEventImg.png"

const FeedVolunteer = () => {
    const [future, setFuture] = useState(false);
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [drafts, setDrafts] = useState([])

    const userId = useSelector(selectCurrentUserId);

    const {
        data: appliedEvents,
        isFetching,
        isSuccess,
    } = useGetApplicationsByVolunteerQuery({volunteerID: userId})

    const handleFuture = () => {
        setFuture(!future)
    }

    useEffect(() => {
        if (isSuccess) {
            const currentDate = dayjs();
            const upcoming = [];
            const past = [];
            const ongoing = [];
            const drafts = []

            appliedEvents.response.applications.forEach((item) => {
                if (item.isDraft === true) {
                    drafts.push(item);
                } else {
                    const eventStartDate = dayjs(item.eventID.startDate);
                    const eventEndDate = dayjs(item.eventID.endDate);
                    if (currentDate.isBefore(eventStartDate)) {
                        upcoming.push(item);
                    } else if (currentDate.isAfter(eventEndDate)) {
                        past.push(item);
                    } else {
                        ongoing.push(item);
                    }
                }
            });
            setDrafts(drafts);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
            setOngoingEvents(ongoing)
            setLoading(false); // Update loading state after data is processed
        }
    }, [isSuccess, appliedEvents]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    // Extract the dates from upcomingEvents for HighlightCalendar
    const highlightedDays = upcomingEvents.map((item) => dayjs(item.eventID.startDate).format("YYYY-MM-DD"));

    return (
        <Grid container>
            <Grid item xs={12} sm={8} sx={{ padding: "50px"}}>
                <Box flex={4} p={{ xs: 0, md: 2 }}>
                    {isFetching ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : isSuccess && (
                        <>
                            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                                <Button variant="outlined" sx={{ padding: 2 }} onClick={handleFuture}>
                                    {future ? "Hide Past events" : 'Show All events'}
                                </Button>
                            </Box>
                            <Box mb={4}>
                                <Typography variant="h2" sx={{padding: 2}}>
                                    Application Drafts
                                </Typography>
                                <Grid container spacing={{xs: 1, md: 2}}>
                                    {drafts && drafts.map((item, index) => {
                                            console.log(item)
                                            return (
                                                <Grid item xs={12} lg={6} key={index}>
                                                    <EventItem
                                                        eventID={item.eventID._id}
                                                        title={item.eventID.title}
                                                        date={item.eventID.startDate}
                                                        image={getFileUrl(item.eventID.uploadURL[0], "image", "default")}
                                                        description={item.eventID.description}
                                                        type={"my-events-volunteer-draft"}
                                                        applicationStatus={item.status}
                                                        applicationID={item._id}
                                                    />
                                                </Grid>
                                            )

                                        }
                                    )}
                                </Grid>
                            </Box>

                            <Box mb={4}>
                                <Typography variant="h2" sx={{ padding: 2 }}>
                                    Ongoing Events
                                </Typography>
                                <Grid container spacing={{ xs: 1, md: 2 }}>
                                    {ongoingEvents.map((item, index) => (
                                        <Grid item xs={12} lg={6} key={index}>
                                            <EventItem
                                                eventID={item.eventID._id}
                                                title={item.eventID.title}
                                                date={item.eventID.startDate}
                                                image={item.eventID.uploadURL && item.eventID.uploadURL.length > 0 ? getFileUrl(item.eventID.uploadURL[0], "image", "display") : defaultEventImg}
                                                description={item.eventID.description}
                                                type={"my-events-volunteer-future"}
                                                applicationStatus={item.status}
                                                applicationID={item._id}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            <Box mb={4}>
                                <Typography variant="h2" sx={{ padding: 2 }}>
                                    Upcoming Events
                                </Typography>
                                <Grid container spacing={{ xs: 1, md: 2 }}>
                                    {upcomingEvents.map((item, index) => (
                                        <Grid item xs={12} lg={6} key={index}>
                                            <EventItem
                                                eventID={item.eventID._id}
                                                title={item.eventID.title}
                                                date={item.eventID.startDate}
                                                image={item.eventID.uploadURL && item.eventID.uploadURL.length > 0 ? getFileUrl(item.eventID.uploadURL[0], "image", "display") : defaultEventImg}
                                                description={item.eventID.description}
                                                type={"my-events-volunteer-future"}
                                                applicationStatus={item.status}
                                                applicationID={item._id}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {future && (
                                <Box>
                                    <Typography variant="h2" sx={{ padding: 2 }}>
                                        Past Events
                                    </Typography>
                                    <Grid container spacing={{ xs: 1, md: 2 }}>
                                        {pastEvents.map((item, index) => (
                                            <Grid item xs={12} lg={6} key={index}>
                                                <EventItem
                                                    eventID={item.eventID._id}
                                                    title={item.eventID.title}
                                                    date={item.eventID.startDate}
                                                    image={item.eventID.uploadURL && item.eventID.uploadURL.length > 0 ? getFileUrl(item.eventID.uploadURL[0], "image", "display") : defaultEventImg}
                                                    description={item.eventID.description}
                                                    type={"my-events-volunteer"}
                                                    applicationStatus={item.status}
                                                    applicationID={item._id}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
                <HighlightCalendar highlightedDays={highlightedDays} sx={{ display: {xs: "none", sm: "block"}}}/>
            </Grid>
        </Grid>
    );
};

export default FeedVolunteer;



