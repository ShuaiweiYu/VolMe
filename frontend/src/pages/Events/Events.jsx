import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Pagination, Stack, Typography} from "@mui/material";
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
import AC from "./image/AC.jpg"
import AW from "./image/AW.jpg"
import CI from "./image/CI.jpg"
import CS from "./image/CS.jpg"
import DR from "./image/DR.jpg"
import EC from "./image/EC.jpg"
import EL from "./image/EL.jpg"
import HF from "./image/HF.jpg"
import HH from "./image/HH.jpg"
import HR from "./image/HR.jpg"
import IV from "./image/IV.jpg"
import MH from "./image/MH.jpg"
import OT from "./image/OT.jpg"
import SE from "./image/SE.jpg"
import SJ from "./image/SJ.jpg"
import SR from "./image/SR.jpg"
import YC from "./image/OT.jpg"
import HM from "./image/HM.jpg"
import Divider from "@mui/material/Divider";

const date = []
const location = []
const languages = [
    {key: "EN", value: "English"},
    {key: "DE", value: "German"},
    {key: "IT", value: "Italien"},
    {key: "ES", value: "Spanish"},
    {key: "CN", value: "Chinese"}
]
const category = [
    {key: "CS", value: "Community Service"},
    {key: "EL", value: "Education and Literacy"},
    {key: "EC", value: "Environment and Conservation"},
    {key: "HM", value: "Health and Medicine"},
    {key: "AW", value: "Animal Welfare"},
    {key: "AC", value: "Arts and Culture"},
    {key: "DR", value: "Disaster Relief"},
    {key: "YC", value: "Youth and Children"},
    {key: "SE", value: "Seniors and Elderly"},
    {key: "SR", value: "Sports and Recreation"},
    {key: "HR", value: "Human Rights"},
    {key: "SJ", value: "Social Justice"},
    {key: "HH", value: "Homelessness and Housing"},
    {key: "HF", value: "Hunger and Food Security"},
    {key: "MH", value: "Mental Health"},
    {key: "IV", value: "International Volunteering"},
    {key: "CI", value: "Crisis Intervention"},
    {key: "OT", value: "Others"}
];
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
// const volunteerCategoriesChinese = [
//     "社区服务",
//     "教育与扫盲",
//     "环境与保护",
//     "健康与医疗",
//     "动物福利",
//     "艺术与文化",
//     "灾难救援",
//     "青少年与儿童",
//     "老年人",
//     "体育与娱乐",
//     "人权",
//     "社会正义",
//     "无家可归与住房",
//     "饥饿与粮食安全",
//     "心理健康",
//     "国际志愿服务",
//     "危机干预"
// ];

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
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={languages}
                    filterSelectedOptions
                    getOptionLabel={(option) => option.value}
                    onChange={(event, newValue) => handleLanguageChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Languages"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={category}
                    filterSelectedOptions
                    getOptionLabel={(option) => option.value}
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
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <SearchBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                               onSearchProp={onSearchProp} onClearProp={onClearProp} label={label}/>
                </Grid>
                <Grid item xs={12} md={10}>
                    <MultipleFilter handleLanguageChange={handleLanguageChange} handleTimeChange={handleTimeChange}
                                    handleLocationChange={handleLocationChange}/>
                </Grid>
            </Grid>
        </Box>

    )
}

const Events = () => {
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [searchTermProp, setSearchTermProp] = useState('');
    const [selectedTime, setSelectedTime] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const userId = useSelector(selectCurrentUserId);
    const {data: user, isSuccessUser, errorUser, isLoadingUser} = useGetUserByUserIdQuery(userId, {
        skip: !userId, // Skip the query if userId is null or undefined
    });

    const handleSearch = () => {
    };

    const handleClear = () => {
        setSearchTermProp('');
    };

    const handleChange = (newValue) => {
        setSelectedLocation(newValue);
    };

    const handleTimeChange = (newValue) => {
        setSelectedTime(newValue);
    };

    const handleLanguageChange = (newValue) => {
        setSelectedLanguage(newValue.map(item => item.key));
    };

    // -----------------> eventlist
    const [page, setPage] = useState(1);

    const {
        data: events,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetEventsQuery({
        page: page,
        keyword: searchTermProp,
        location: selectedLocation,
        time: selectedTime,
        language: selectedLanguage
    });
    // todo: get location from this list
    // todo: get category from this list

    console.log(events)

    // todo: change ordering
    const sortedEvents = events?.response?.events.slice().sort((a, b) => {
        const aType = a.response?.organiser?.subscriptionType !== 'FREE';
        const bType = b.response?.organiser?.subscriptionType !== 'FREE';
        if (aType !== bType) return bType - aType;
        return b.isSponsored - a.isSponsored;
    });


    return (
        <Stack direction={{xs: 'column', md: 'row'}} justifyContent="space-around" marginTop={1} marginLeft={5}
               marginRight={5}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ToolBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                             onSearchProp={handleSearch} onClearProp={handleClear} label={"Enter event name"}
                             handleLocationChange={handleChange}
                             handleLanguageChange={handleLanguageChange}
                             handleTimeChange={handleTimeChange}
                    />
                </Grid>
                {/*-----------------> eventlist*/}
                <Grid item xs={12}>
                    <Grid container columns={12} spacing={{xs: 1, md: 2}}>
                        {(isFetching || isLoading) ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100vh',
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
                                    height: '100vh',
                                }}
                            >
                                <Typography variant="h6" color="error">
                                    {error?.data?.message || 'An error occurred while fetching events.'}
                                </Typography>
                            </Box>
                        ) : isSuccess && (
                            <>
                                {sortedEvents.map((event, index) => (
                                    <Grid item xs={12} md={6} lg={4} xl={3} key={index} display="flex"
                                          alignItems="center"
                                          justifyContent="center">
                                        <EventItem
                                            eventID={event._id}
                                            title={event.title}
                                            date={event.startDate}
                                            image={event.uploadURL.length !== 0 ? getFileUrl(event.uploadURL[0], "image", "default") : images.find(img => img.key === event.category)?.value}
                                            description={event.description}
                                            promotion={event.isSponsored}
                                            type={user?.response.role === 'VOLUNTEER' ? 'event-listing-volunteer' : 'event-listing'}
                                        />
                                    </Grid>
                                ))}
                            </>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Events;