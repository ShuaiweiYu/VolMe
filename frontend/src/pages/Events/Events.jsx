import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Pagination, Paper, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import {useGetEventsQuery} from "../../redux/events/eventApiSlice";
import EventItem from "../../components/Events/EventItem";
import {getFileUrl} from "../../util/fileUploaderWrapper";

const styles = {
    container: {
        display: 'flex',
    },
    left: {
        flex: '0 0 30%',  // Adjust the width percentage as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',  // Center children horizontally
        padding: '20px',
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
    },
    right: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
        width: '150px',
        marginTop: '10px',
    }
};

const SearchBar = ({searchTermProp, setSearchTermProp, onSearchProp, onClearProp, label}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchProp();
        }
    };

    return (
        <TextField
            id="searchInput"
            label={label}
            sx={{paddingBottom: '20px'}}
            value={searchTermProp}
            fullWidth
            onChange={(e) => setSearchTermProp(e.target.value)}
            onKeyDown={handleKeyDown}
            InputLabelProps={{shrink: true}}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {!searchTermProp && <SearchIcon/>}
                        {searchTermProp && (
                            <IconButton
                                onClick={onClearProp}
                                edge="end"
                            >
                                <ClearIcon/>
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};

const MultipleFilter = ({handleTimeChange, handleLocationChange, handleLanguageChange}) => {
    const date = ["Past", "Future"]
    const location = ["Munich", "Garching bei München"]
    const languages = ["English", "German", "Italian", "Spanish"]
    const category = ["a", "b"]
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={date}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleTimeChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Date"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={location}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLocationChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={languages}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLanguageChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Languages"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={category}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLanguageChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category"
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}

const ToolBar = ({
                     searchTermProp,
                     setSearchTermProp,
                     onSearchProp,
                     onClearProp,
                     label,
                     handleTimeChange,
                     handleLocationChange,
                     handleLanguageChange
                 }) => {
    return (
        <Box
            sx={{
                '& > :not(style)': {
                    m: 1,
                    width: "100%",
                    height: 80,
                },
            }}
        >
            {/*<Paper elevation={0}>*/}
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <SearchBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                                   onSearchProp={onSearchProp} onClearProp={onClearProp} label={label}/>
                    </Grid>
                    <Grid item xs={10}>
                        <MultipleFilter handleLanguageChange={handleLanguageChange} handleTimeChange={handleTimeChange} handleLocationChange={handleLocationChange}/>
                    </Grid>
                </Grid>
            {/*</Paper>*/}
        </Box>

    )
}

const Events = () => {
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [searchTermProp, setSearchTermProp] = useState('');
    const [renderEventList, setRenderEventList] = useState(false);
    const [selectedTime, setSelectedTime] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const userId = useSelector(selectCurrentUserId);
    const { data: user, isSuccessUser, errorUser, isLoadingUser } = useGetUserByUserIdQuery(userId, {
        skip: !userId, // Skip the query if userId is null or undefined
    });

    const handleSearch = () => {
    };

    const handleClear = () => {
        setSearchTermProp('');
    };

    const handleChange = (newValue) => {
        setSelectedLocation(newValue);
        setRenderEventList(false);
    };

    const handleTimeChange = (newValue) => {
        setSelectedTime(newValue);
        setRenderEventList(false);

    };

    const handleLanguageChange = (newValue) => {
        setSelectedLanguage(newValue);
        setRenderEventList(false);
    };

    useEffect(() => {
        setRenderEventList(true);
    }, [selectedLocation]);

    useEffect(() => {
        setRenderEventList(true);
    }, [selectedTime]);

    useEffect(() => {
        setRenderEventList(true);
    }, [selectedLanguage]);
    
    
    // eventlist
    const [page, setPage] = useState(1);

    const {
        data: events,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetEventsQuery({page: page, keyword: searchTermProp, location: selectedLocation, time: selectedTime, language: selectedLanguage});
    // todo: get location from this list
    // todo: get category from this list

    const sortedEvents = events?.response?.events.slice().sort((a, b) => {
        const aType = a.response?.organiser?.subscriptionType !== 'FREE';
        const bType = b.response?.organiser?.subscriptionType !== 'FREE';
        if (aType !== bType) return bType - aType;
        return b.isSponsored - a.isSponsored;
    });


    return (
        <Stack direction="row" justifyContent="space-around" marginTop={1} marginLeft={5} marginRight={5}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ToolBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                             onSearchProp={handleSearch} onClearProp={handleClear} label={"Enter event name"}
                             handleLocationChange={handleChange}
                             handleLanguageChange={handleLanguageChange}
                             handleTimeChange={handleTimeChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack>
                        <Grid container columns={12} spacing={{xs: 1, md: 2}}>
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
                                    <CircularProgress/>
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
                                        <Grid item xs={12} md={6} lg={4} xl={3} key={index} display="flex" alignItems="center"
                                              justifyContent="center">
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
                                sx={{padding: 2}}
                                count={events.response.pages}
                                page={page}
                                onChange={(event, value) => {
                                    setPage(value);
                                }}
                                variant="outlined"
                                size="small"
                            />}
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Events;