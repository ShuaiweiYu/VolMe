import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    useCreateEventMutation,
    useUploadEventImageMutation,
} from "../../redux/events/eventApiSlice";
import {useFetchCategoriesQuery} from "../../redux/events/categoryApiSlice";
import {toast} from "react-toastify";
import {
    TextField,
    Button,
    Typography, Container, Stack, ButtonGroup, FormControl, InputLabel, Select, MenuItem,
    Box,
    Grid, FormControlLabel, Checkbox, FormGroup, Divider
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {t} from "i18next";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Country, State, City} from 'country-state-city';
import Map3 from '../../components/GoogleMap/Map';
import DescriptionEditor from "../../components/CreateEventPage/DescriptionEditor";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import ImageUploadBox from "../../components/Upload/ImageUploadBox";
import {LANGUAGE} from '../../components/CreateEventPage/language';
import {useCheckSubscriptionValidityMutation} from '../../redux/payment/paymentApiSlice'
import {useGetUserByUserIdQuery} from '../../redux/users/usersApiSlice'
import {useGetEventCountByIdMutation} from '../../redux/events/eventApiSlice'
import {useUpdateUserMutation} from '../../redux/users/usersApiSlice'
import {styled} from "@mui/system";
import {useTranslation} from "react-i18next";

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

const CreateEvent = () => {
    const {t} = useTranslation();

    const [title, setTitle] = useState("");
    const organiser = useSelector(selectCurrentUserId);
    const organizerObj = useGetUserByUserIdQuery(organiser)

    //const [location, setLocation] = useState("");
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [address, setAddress] = useState("");
    const [houseNumber, setHouseNumber] = useState(null);
    const [zipCode, setZipCode] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [description, setDescription] = useState("");
    const [peopleNeeded, setPeopleNeeded] = useState(null);
    const [category, setCategory] = useState("");

    const [languages, setLanguages] = useState([]);
    const languageList = ["English", "German", "Spanish", "French", "Chinese", "Italian"];

    const [uploadEventImage] = useUploadEventImageMutation();
    const [createEvent] = useCreateEventMutation();
    const {data: categories} = useFetchCategoriesQuery();

    const [uploadURL, setUploadURL] = useState([]);
    const [renderUploadURL, setRenderUploadURL] = useState(false);

    const [checkValidity] = useCheckSubscriptionValidityMutation()
    const [getEventCount] = useGetEventCountByIdMutation()
    const [updateUser] = useUpdateUserMutation()

    const location = `${address} ${houseNumber}, ${zipCode} ${selectedCity?.name || ""},
     ${selectedState?.name || ""}, ${selectedCountry?.name || ""}`;

    const handleLanguageChange = (event) => {
        const language = event.target.name;
        setLanguages((prevSelectedLanguages) =>
            event.target.checked
                ? [...prevSelectedLanguages, language]
                : prevSelectedLanguages.filter((lang) => lang !== language)
        );
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // return to the previous page if cancel creating event
    };

    const defaultOptions = ['Resume', 'Motivation Letter'];
    const [requiredFiles, setRequiredFiles] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [newOption, setNewOption] = useState('');

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prevSelectedOptions =>
            prevSelectedOptions.includes(option)
                ? prevSelectedOptions.filter(opt => opt !== option)
                : [...prevSelectedOptions, option]
        );
    };

    const handleAddOption = () => {
        if (newOption && !requiredFiles.includes(newOption)) {
            setRequiredFiles([...requiredFiles, newOption]);
            setSelectedOptions([...selectedOptions, newOption]); // Automatically select the new option
            setNewOption('');
        }
    };

    const handleURLChange = (newURLs) => {
        setUploadURL(newURLs);
        setRenderUploadURL(false);
    };

    useEffect(() => {
        setRenderUploadURL(true);
    }, [uploadURL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (organizerObj.data.response.subscriptionType === "FREE") {
            const {data: count} = await getEventCount({id: organiser, creationPlan: "FREE"})
            if (peopleNeeded > 10) {
                toast.error("Free Plan can only have 10 participants!");
                return
            } else if (count.response.eventCount >= 1) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        } else if (organizerObj.data.response.subscriptionType === "PAYASYOUGO") {
            if (organizerObj.data.response.unusedPaidSubscription > 0) {
                const newAmount = organizerObj.data.response.unusedPaidSubscription - 1
                const user = await updateUser({userId: organiser, updateData: {unusedPaidSubscription: newAmount}})
                if (user.data.response.unusedPaidSubscription === 0) {
                    await updateUser({userId: organiser, updateData: {subscriptionType: "FREE"}})
                }
            } else {
                toast.error("Your unused Pay As You Go plan is not enough!");
                return
            }
            return
        } else if (organizerObj.data.response.subscriptionType === "BASIC") {
            const {data: count} = await getEventCount({id: organiser, creationPlan: "BASIC"})
            const result = await checkValidity({userID: organizerObj.data.response._id})
            if (result.data.status !== 'ACTIVE') {
                toast.error("Your subscription is invalid!");
                return
            } else if (count.response.eventCount > 5) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        } else if (organizerObj.data.response.subscriptionType === "PREMIUM") {
            const {data: count} = await getEventCount({id: organiser, creationPlan: "BASIC"})
            const result = await checkValidity({userID: organizerObj.data.response._id})
            if (result.data.status !== 'ACTIVE') {
                toast.error("Your subscription is invalid!");
                return
            } else if (count.response.eventCount > 20) {
                toast.error("You have reached the monthly event creation limit");
                return
            }
        }

        while (!renderUploadURL) {
            toast.error("Upload URL is not ready yet. Please try again.");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
            let eventData = {
                "title": title,
                "organiser": organiser.toString(),
                "startDate": startDate,
                "endDate": endDate,
                "selectedCountry": selectedCountry,
                "selectedState": selectedState,
                "selectedCity": selectedCity,
                "address": address,
                "houseNumber": houseNumber,
                "zipCode": zipCode,
                //"location": location,
                "description": description,
                "peopleNeeded": peopleNeeded,
                "category": category,
                "requiredFiles": requiredFiles,
                "languages": languages,
                "uploadURL": uploadURL,
                "creationPlan": organizerObj.data.response.subscriptionType
            };

            const event = await createEvent(eventData);

            if (event.error) {
                toast.error("Failed to create event. Please try again.");
            } else {
                console.log(event)
                console.log(event.data.response.event._id)
                toast.success(`${title} is created`);
                navigate(`/events/${event.data.response.event._id}`);
            }
        } catch (error) {
            toast.error("Failed to create event. Please try again.");
        }
    };


    useEffect(() => {
        setCountry(Country.getAllCountries());
    }, []);


    const handleCountryChange = (event, value) => {
        setSelectedCountry(value);
        setSelectedState(null);
        setSelectedCity(null);
        setState(value ? State.getStatesOfCountry(value.isoCode) : []);
        setCity([]);
    };

    const handleStateChange = (event, value) => {
        setSelectedState(value);
        setSelectedCity(null);
        setCity(value ? City.getCitiesOfState(selectedCountry.isoCode, value.isoCode) : []);
    };

    const handleCityChange = (event, value) => {
        setSelectedCity(value);
    };

    const handleEditorChange = (content) => {
        setDescription(content);
    };

    const today = dayjs();

    return (
        <Box id="create-event">
            <Container component="main" maxWidth="md">
                <Box sx={{marginTop: 8}}>
                    <Typography variant="h1" align="center" gutterBottom>{t("createEvent.postEvent")}</Typography>
                    <Divider sx={{margin: '20px 0'}}/>
                    <Stack
                        component="form"
                        noValidate
                        sx={{mt: 3}}
                    >
                        <Stack container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h2" sx={{margin: '20px 0'}}>{t("createEvent.nameEvent")}</Typography>
                                <TextField
                                    required
                                    fullWidth
                                    id="eventtitle"
                                    label={t("createEvent.eventTitle")}
                                    autoFocus
                                    //placeholder="Name your event here"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    sx={{borderRadius: '30px'}}
                                />
                            </Grid>

                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2">{t("createEvent.place")}</Typography>
                            <Stack direction="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            options={country}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedCountry}
                                            onChange={handleCountryChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("createEvent.country")}
                                                    margin="normal"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            options={state}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedState}
                                            onChange={handleStateChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("createEvent.state")}
                                                    margin="normal"
                                                    fullWidth
                                                    disabled={!selectedCountry}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            options={city}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedCity}
                                            onChange={handleCityChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t("createEvent.city")}
                                                    margin="normal"
                                                    fullWidth
                                                    disabled={!selectedState}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>

                            <Stack direction="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            //id="address"
                                            //name="address"
                                            label={t("createEvent.address")}
                                            value={address}
                                            onChange={(event) => setAddress(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            fullWidth
                                            //id="house number"
                                            //name="house number"
                                            label={t("createEvent.houseNumber")}
                                            value={houseNumber}
                                            onChange={(event) => setHouseNumber(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            fullWidth
                                            label={t("createEvent.zipCode")}
                                            value={zipCode}
                                            onChange={(event) => setZipCode(event.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{width: '100%'}}>
                                    {location !== "" ? (
                                        <Map3
                                            address={`${location}, ${selectedCity?.name || ""}, ${selectedState?.name || ""}, ${selectedCountry?.name || ""}`}
                                        />
                                    ) : (
                                        <Map3 address={"Boltzmannstraße 15, Garching bei München, Germany"}/>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2" sx={{margin: '20px 0'}}>{t("createEvent.date")}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack direction="row" spacing={2}>
                                            <DateTimePicker
                                                label={t("createEvent.startDate")}
                                                value={startDate}
                                                minDate={dayjs()}
                                                maxDate={dayjs().add(10, "year")}
                                                onChange={(newValue) => setStartDate(newValue)}
                                                renderInput={(props) => (
                                                    <TextField
                                                        {...props}
                                                        fullWidth
                                                        margin="normal"
                                                        required
                                                    />
                                                )}
                                            />
                                            <DateTimePicker
                                                label={t("createEvent.endDate")}
                                                value={endDate}
                                                minDate={startDate || dayjs()}
                                                maxDate={dayjs().add(10, "year")}
                                                onChange={(newValue) => setEndDate(newValue)}
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
                                </Box>
                            </Grid>

                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2" sx={{margin: '20px 0'}}>{t("createEvent.description")}</Typography>
                            <Grid item xs={12} sm={6}>
                                <DescriptionEditor
                                    label={t("createEvent.eventDescription")}
                                    value={description}
                                    onChange={handleEditorChange}
                                />
                            </Grid>

                            <Divider sx={{margin: '20px 0'}}/>
                            <Typography variant="h2">{t("createEvent.peopleNeededAndCategory")}</Typography>
                            <Stack direction="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label={t("createEvent.peopleNeeded")}
                                            type="number"
                                            value={peopleNeeded}
                                            placeholder="min 5, max 200"
                                            InputProps={{inputProps: {min: 5, max: 200}}}
                                            onChange={(event) => setPeopleNeeded(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="category-label">Category</InputLabel>
                                            <Select
                                                labelId="category-label"
                                                id="category-select"
                                                value={category}
                                                label={t("createEvent.category")}
                                                onChange={(event) => setCategory(event.target.value)}
                                            >
                                                {categories?.map((cat) => (
                                                    <MenuItem key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Stack>

                            <Box sx={{ marginTop: 2 }}>
                                <Divider sx={{ margin: '20px 0' }} />
                                <Typography variant="h2">Select Required Documents</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                                    {[...defaultOptions, ...requiredFiles].map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={selectedOptions.includes(option)}
                                                    onChange={() => handleCheckboxChange(option)}
                                                />
                                            }
                                            label={option}
                                        />
                                    ))}
                                </Box>
                                <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                                    <TextField
                                        label="Add Custom Option"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={handleAddOption}>Add</Button>
                                </Stack>
                            </Box>

                            <Box sx={{marginTop: 2,}}>
                                <Divider sx={{margin: '20px 0'}}/>
                                <Typography variant="h2">{t("createEvent.selectWorkingLanguages")}</Typography>
                                <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2}}>
                                    {languageList.map((language) => (
                                        <FormControlLabel
                                            key={language}
                                            control={
                                                <Checkbox
                                                    checked={languages.includes(language)}
                                                    onChange={handleLanguageChange}
                                                    name={language}
                                                />
                                            }
                                            label={language}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Grid item xs={12} sm={6}>
                                <Divider sx={{margin: '20px 0'}}/>
                                <Typography variant="h2" sx={{margin: '20px 0'}}>{t("createEvent.addPictures")}</Typography>
                                <ImageUploadBox onURLChange={handleURLChange}/>
                            </Grid>

                            <br/>

                            <Stack direction="row">
                                <Grid container spacing={5}>
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                            }}
                                        >
                                            <Typography variant="h3">{t("createEvent.create")}</Typography>
                                        </StyledButton>
                                    </Grid>
                                    {/*
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            variant="outlined"
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                                color: "primary",
                                                borderColor: "primary",
                                            }}
                                        >
                                            <Typography variant="h3" color="primary">Save to draft</Typography>
                                        </StyledButton>
                                    </Grid>
                                    */}
                                    <Grid item xs={12} sm={4}>
                                        <StyledButton
                                            variant="outlined"
                                            onClick={handleGoBack}
                                            sx={{
                                                width: "100%",
                                                height: "60px",
                                                color: "primary",
                                                borderColor: "primary",
                                            }}
                                        >
                                            <Typography variant="h3" color="primary">{t("createEvent.cancel")}</Typography>
                                        </StyledButton>
                                    </Grid>
                                </Grid>
                            </Stack>

                            <br/>

                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateEvent;