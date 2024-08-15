import React, {useEffect, useState} from 'react';
import EventList from '../../components/Events/EventList';
import {Box, Button, Paper, Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";

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

const StyledButton = styled(Button)(({theme, variant}) => ({
    padding: '10px 20px',
    width: '200px',  // Set a fixed width
    height: '50px',
    borderRadius: '30px',
    ...(variant === 'outlined' && {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            color: "white",
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
                    // multiple
                    id="tags-outlined"
                    options={date}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleTimeChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Date"
                            placeholder="Favorites"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    // multiple
                    id="tags-outlined"
                    options={location}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLocationChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location"
                            placeholder="Favorites"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    // multiple
                    id="tags-outlined"
                    options={languages}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLanguageChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Languages"
                            placeholder="Favorites"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    // multiple
                    id="tags-outlined"
                    options={category}
                    filterSelectedOptions
                    onChange={(event, newValue) => handleLanguageChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category"
                            placeholder="Favorites"
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
    const {data: user, isSuccessUser, errorUser, isLoadingUser} = useGetUserByUserIdQuery(userId);


    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleSearch = () => {
        // todo: Add search functionality here using find event by name
    };

    const handleClear = () => {
        setSearchTermProp('');
    };

    const handleChange = (event) => {
        //add search events by....
        const value = event.target.value;
        setSelectedLocation((prevSelectedLocation) => {
            // If the value is already in the array, remove it, otherwise add it
            if (prevSelectedLocation.includes(value)) {
                return prevSelectedLocation.filter((item) => item !== value);
            } else {
                return [...prevSelectedLocation, value];
            }
        });
        setRenderEventList(false);
    };

    const handleTimeChange = (event) => {
        //add search events by....
        const value = event.target.value;

        setSelectedTime((prevSelectedTime) => {
            // If the value is already in the array, remove it, otherwise add it
            if (prevSelectedTime.includes(value)) {
                return prevSelectedTime.filter((item) => item !== value);
            } else {
                return [...prevSelectedTime, value];
            }
        });
        setRenderEventList(false);

    };

    const handleLanguageChange = (event) => {
        //add search events by....
        const value = event.target.value;

        setSelectedLanguage((prevSelectedLanguage) => {
            // If the value is already in the array, remove it, otherwise add it
            if (prevSelectedLanguage.includes(value)) {
                return prevSelectedLanguage.filter((item) => item !== value);
            } else {
                return [...prevSelectedLanguage, value];
            }
        });
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


    return (
        <Stack direction="row" justifyContent="space-around" marginTop={1} marginLeft={5} marginRight={5}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/*todo: 把eventlist放在这里，不要单独做成一个组件，然后根据相应的关键词来做筛选*/}
                    {/*<ToolBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}*/}
                    {/*         onSearchProp={handleSearch} onClearProp={handleClear} label={"Enter event name"}*/}
                    {/*         handleLocationChange={handleChange}*/}
                    {/*         handleLanguageChange={handleLanguageChange}*/}
                    {/*         handleTimeChange={handleTimeChange}*/}
                    {/*/>*/}
                </Grid>
                <Grid item xs={12} style={styles.right}>
                    {renderEventList &&
                        <EventList searchTerm={searchTermProp} location={selectedLocation} time={selectedTime}
                                   language={selectedLanguage}/>}
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Events;