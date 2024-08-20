import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Pagination, Stack, styled, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import {useGetEventsQuery, useGetEventCityQuery} from "../../redux/events/eventApiSlice";
import EventItem from "./EventItem";
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
import useRole from "../../redux/auth/useRole";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useTranslation} from "react-i18next";

const SearchBar = ({searchTermProp, setSearchTermProp, onSearchProp, onClearProp}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchProp();
        }
    };

    const {t} = useTranslation();

    return (
        <TextField
            id="searchInput"
            label={t("events.search")}
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

const MultipleFilter = ({
                            startDate,
                            endDate,
                            handleStartTimeChange,
                            handleEndTimeChange,
                            handleLocationChange,
                            handleLanguageChange,
                            handleCategoryChange
                        }) => {
    const {t} = useTranslation();

    const languages = [
        {key: "EN", value: t("events.en")},
        {key: "DE", value: t("events.de")},
        {key: "IT", value: t("events.it")},
        {key: "ES", value: t("events.es")},
        {key: "FR", value: t("events.fr")},
        {key: "CN", value: t("events.cn")}
    ]
    const category = [
        {key: "CS", value: t("events.CS")},
        {key: "EL", value: t("events.EL")},
        {key: "EC", value: t("events.EC")},
        {key: "HM", value: t("events.HM")},
        {key: "AW", value: t("events.AW")},
        {key: "AC", value: t("events.AC")},
        {key: "DR", value: t("events.DR")},
        {key: "YC", value: t("events.YC")},
        {key: "SE", value: t("events.SE")},
        {key: "SR", value: t("events.SR")},
        {key: "HR", value: t("events.HR")},
        {key: "SJ", value: t("events.SJ")},
        {key: "HH", value: t("events.HH")},
        {key: "HF", value: t("events.HF")},
        {key: "MH", value: t("events.MH")},
        {key: "IV", value: t("events.IV")},
        {key: "CI", value: t("events.CI")},
        {key: "OT", value: t("events.OT")}
    ];

    const [cities, setCities] = useState([]);

    const {data: citylist, isSuccess: isGetCitylistSuccess} = useGetEventCityQuery();

    useEffect(() => {
        if (isGetCitylistSuccess) {
            setCities(citylist.response.map(city => city.city));
        }
    }, [isGetCitylistSuccess, citylist]);

    const FullWidthDatePicker = styled(DatePicker)(({theme}) => ({
        width: '100%',
        margin: theme.spacing(1, 0),
    }));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack direction="row" spacing={1}>
                        <FullWidthDatePicker
                            label={t("events.startDate")}
                            value={startDate}
                            minDate={dayjs()}
                            maxDate={dayjs().add(1, "year")}
                            onChange={(newValue) => handleStartTimeChange(newValue)}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            )}
                        />
                        <FullWidthDatePicker
                            label={t("events.endDate")}
                            value={endDate}
                            minDate={startDate || dayjs()}
                            maxDate={dayjs().add(1, "year")}
                            onChange={(newValue) => handleEndTimeChange(newValue)}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            )}
                        />
                    </Stack>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={cities}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLocationChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("events.location")}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={2}>
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
                            label={t("events.language")}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={category}
                    filterSelectedOptions
                    getOptionLabel={(option) => option.value}
                    onChange={(event, newValue) => handleCategoryChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("events.category")}
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
                     startDate,
                     endDate,
                     handleStartTimeChange,
                     handleEndTimeChange,
                     handleLocationChange,
                     handleLanguageChange,
                     handleCategoryChange
                 }) => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <SearchBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                               onSearchProp={onSearchProp} onClearProp={onClearProp}/>
                </Grid>
                <Grid item xs={12} md={10}>
                    <MultipleFilter
                        startDate={startDate}
                        endDate={endDate}
                        handleStartTimeChange={handleStartTimeChange}
                        handleEndTimeChange={handleEndTimeChange}
                        handleLocationChange={handleLocationChange}
                        handleLanguageChange={handleLanguageChange}
                        handleCategoryChange={handleCategoryChange}/>
                </Grid>
            </Grid>
        </Box>

    )
}

const Events = () => {

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

    const [searchTermProp, setSearchTermProp] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const {role} = useRole()

    const handleSearch = () => {
    };

    const handleClear = () => {
        setSearchTermProp('');
    };

    const handleChange = (newValue) => {
        setSelectedLocation(newValue);
    };

    const handleStartTimeChange = (newValue) => {
        setStartDate(newValue)
    };

    const handleEndTimeChange = (newValue) => {
        setEndDate(newValue)
    };

    const handleLanguageChange = (newValue) => {
        setSelectedLanguage(newValue.map(item => item.key));
    };

    const handleCategoryChange = (newValue) => {
        setSelectedCategory(newValue.map(item => item.key));
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
        startDate: startDate,
        endDate: endDate,
        location: selectedLocation,
        language: selectedLanguage,
        category: selectedCategory
    });

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
                <Grid item xs={12} paddingTop="10px">
                    <ToolBar
                        searchTermProp={searchTermProp}
                        setSearchTermProp={setSearchTermProp}
                        onSearchProp={handleSearch}
                        onClearProp={handleClear}
                        startDate={startDate}
                        endDate={endDate}
                        handleStartTimeChange={handleStartTimeChange}
                        handleEndTimeChange={handleEndTimeChange}
                        handleLocationChange={handleChange}
                        handleLanguageChange={handleLanguageChange}
                        handleCategoryChange={handleCategoryChange}
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
                                            type={role === 'VOLUNTEER' ? 'event-listing-volunteer' : 'event-listing'}
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
                            count={events.response.pages || 1}
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