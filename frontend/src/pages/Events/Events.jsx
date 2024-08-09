import React, {useEffect, useState} from 'react';
import Filter from '../../components/Filter/Filter.jsx';
import EventList from '../../components/Events/EventList';
import {Box, Button, Stack} from "@mui/material";
import SearchBar from '../../components/SearchBar'
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {styled} from "@mui/system";


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
        <Stack direction="row" justifyContent="space-around" margin={10}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Box
                        position='fixed'
                        sx={{
                            '& .MuiTextField-root': {width: '240px'},
                            marginBottom: '10px',
                            paddingBottom: '10px'
                        }}>
                        <SearchBar searchTermProp={searchTermProp} setSearchTermProp={setSearchTermProp}
                                   onSearchProp={handleSearch} onClearProp={handleClear} label={"Enter event name"}/>
                        <Filter handleChange={handleChange} handleTimeChange={handleTimeChange}
                                handleLanguageChange={handleLanguageChange}/>
                        {user?.response.role === 'ORGANIZER' &&
                            <Box sx={{width: "80%", display: 'flex', justifyContent: 'center', padding: '20px'}}>
                                <StyledButton variant="contained" onClick={() => handleNavigate('/create-event')}>Post an
                                    event
                                </StyledButton>
                            </Box>}
                    </Box>
                </Grid>
                <Grid item xs={9} style={styles.right}>
                    {renderEventList &&
                        <EventList searchTerm={searchTermProp} location={selectedLocation} time={selectedTime}
                                   language={selectedLanguage}/>}
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Events;