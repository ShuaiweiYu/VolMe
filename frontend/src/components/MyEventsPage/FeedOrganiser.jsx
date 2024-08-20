import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box, Button, CircularProgress, Grid,  Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../redux/auth/authSlice";
import { useGetEventsByOrganiserQuery } from "../../redux/events/eventApiSlice";
import HighlightCalendar from "../../components/MyEventsPage/HighlightCalendar";
import EventItem from "../../pages/events/EventItem";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import defaultEventImg from "../../Assets/defaultEventImg.png";

const FeedOrganiser = () => {
    const [future, setFuture] = useState(false);
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const userId = useSelector(selectCurrentUserId);

    const { data: postedEvents, isLoading: isFetching, isSuccess } = useGetEventsByOrganiserQuery(userId);

    useEffect(() => {
        if (isSuccess) {
            const currentDate = dayjs();
            const upcoming = [];
            const past = [];
            const ongoing = [];


            postedEvents?.response.forEach((item) => {
                const eventStartDate = dayjs(item.startDate);
                const eventEndDate = dayjs(item.endDate);
                if (currentDate.isBefore(eventStartDate)) {
                    upcoming.push(item);
                } else if (currentDate.isAfter(eventEndDate)) {
                    past.push(item);
                } else {
                    ongoing.push(item);
                }
            });

            setUpcomingEvents(upcoming);
            setPastEvents(past);
            setOngoingEvents(ongoing)
            setLoading(false); // Update loading state after data is processed
        }
    }, [isSuccess, postedEvents]);

    const handleFuture = () => {
        setFuture(!future);
    };

    // Extract the dates from upcomingEvents for HighlightCalendar
    const highlightedDays = upcomingEvents.map((item) => dayjs(item.startDate).format("YYYY-MM-DD"));

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
                                <Typography variant="h2" sx={{ padding: 2 }}>
                                    Ongoing Events
                                </Typography>
                                <Grid container spacing={{ xs: 1, md: 2 }}>
                                    {ongoingEvents.map((item, index) => (
                                        <Grid item xs={12} lg={6} key={index}>
                                            <EventItem
                                                eventID={item._id}
                                                title={item.title}
                                                date={item.startDate}
                                                image={item.uploadURL && item.uploadURL.length > 0 ? getFileUrl(item.uploadURL[0], "image", "display") : defaultEventImg}
                                                description={item.description}
                                                type={"my-events-organiser-future"}
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
                                                eventID={item._id}
                                                title={item.title}
                                                date={item.startDate}
                                                image={item.uploadURL && item.uploadURL.length > 0 ? getFileUrl(item.uploadURL[0], "image", "display") : defaultEventImg}
                                                description={item.description}
                                                type={"my-events-organiser-future"}
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
                                                    eventID={item._id}
                                                    title={item.title}
                                                    date={item.startDate}
                                                    image={item.uploadURL && item.uploadURL.length > 0 ? getFileUrl(item.uploadURL[0], "image", "display") : defaultEventImg}
                                                    description={item.description}
                                                    type={"my-events-organiser"}
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

export default FeedOrganiser;



