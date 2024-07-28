import {Link, useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Avatar,
    Divider,
    Container,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import {
    useGetEventByIdQuery,
    useCreateReviewMutation,
    useUpdateEventMutation,
    useDeleteReviewMutation
} from "../../redux/events/eventApiSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {
    useAddWishlistItemMutation,
    useDeleteWishlistItemByEventMutation,
    useGetWishlistItemsForUserQuery
} from "../../redux/wishlist/wishlistApiSlice";
import ImageWindow from "../../components/EventPage/ImageWindow";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import Rating from '@mui/material/Rating';
import DOMPurify from 'dompurify';
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {toast} from 'react-toastify';
import Map3 from '../../components/GoogleMap/Map';
import ChatPopupButton from "../../components/Chat/ChatPopupButton";
import DescriptionEditor from "../../components/CreateEventPage/DescriptionEditor";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import Autocomplete from "@mui/material/Autocomplete";
import {City, Country, State} from "country-state-city";
import LoadingComponent from "../../components/LoadingComponent";
import {useFetchCategoriesQuery, useFetchCategoryByIdQuery} from "../../redux/events/categoryApiSlice";
import {styled} from "@mui/system";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {getFileUrl} from "../../util/fileUploaderWrapper";
import ImageUploadBox from "../../components/Upload/ImageUploadBox";
import {useTranslation} from "react-i18next";

dayjs.extend(utc);
dayjs.extend(timezone);

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

const EventPage2 = () => {
    const {t} = useTranslation();

    const {eventID} = useParams();
    const {data: event, isLoading, error, refetch} = useGetEventByIdQuery(eventID);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [organiser, setOrganiser] = useState('');
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const [selectedState, setSelectedState] = useState({});
    const [selectedCity, setSelectedCity] = useState({});
    const [address, setAddress] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [description, setDescription] = useState('');
    const [peopleNeeded, setPeopleNeeded] = useState('');
    const [category, setCategory] = useState('');
    const [languages, setLanguages] = useState([]);
    const [uploadURL, setUploadURL] = useState('');
    const [renderUploadURL, setRenderUploadURL] = useState(false);

    const defaultOptions = ['Resume', 'Motivation Letter'];
    const [allOptions, setAllOptions] = useState(defaultOptions);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [requiredFiles, setRequiredFiles] = useState([]);
    const [newOption, setNewOption] = useState('');

    const [updateEvent] = useUpdateEventMutation();
    const {data: categories} = useFetchCategoriesQuery();
    const languageList = ["English", "German", "Spanish", "French", "Chinese", "Italian"];

    const userID = useSelector(selectCurrentUserId);
    const {data: user} = useGetUserByUserIdQuery(userID, {skip: !userID});
    const {data: wishlistItems} = useGetWishlistItemsForUserQuery(userID);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [addWishList] = useAddWishlistItemMutation();
    const [deleteWishList] = useDeleteWishlistItemByEventMutation();

    const {data: categoryObj} = useFetchCategoryByIdQuery(event?.response?.category);
    const categoryName = categoryObj?.name;

    const [createReview] = useCreateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    useEffect(() => {
        if (event) {
            setTitle(event.response.title);
            setOrganiser(event.response.organiser);
            setStartDate(event.response.startDate);
            setEndDate(event.response.endDate);
            setSelectedCountry(event.response.selectedCountry || {});
            setSelectedState(event.response.selectedState || {});
            setSelectedCity(event.response.selectedCity || {});
            setAddress(event.response.address);
            setHouseNumber(event.response.houseNumber);
            setZipCode(event.response.zipCode);
            setDescription(event.response.description);
            setPeopleNeeded(event.response.peopleNeeded);
            setCategory(event.response.category);
            setLanguages(event.response.languages);
            setUploadURL(event.response.uploadURL);
            setRequiredFiles(event.response.requiredFiles);
            setSelectedOptions(event.response.requiredFiles)
        }
    }, [event]);

    useEffect(() => {
        setCountry(Country.getAllCountries());
        if (selectedCountry?.isoCode) {
            setState(State.getStatesOfCountry(selectedCountry.isoCode));
            if (selectedState?.isoCode) {
                setCity(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
            }
        }
    }, [selectedCountry, selectedState]);

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.name;
        setLanguages(prevLanguages =>
            prevLanguages.includes(selectedLanguage)
                ? prevLanguages.filter(language => language !== selectedLanguage)
                : [...prevLanguages, selectedLanguage]
        );
    };

    useEffect(() => {
        setRequiredFiles(selectedOptions);
    }, [selectedOptions]);

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prevSelectedOptions =>
            prevSelectedOptions.includes(option)
                ? prevSelectedOptions.filter(opt => opt !== option)
                : [...prevSelectedOptions, option]
        );
    };

    const handleAddOption = () => {
        if (newOption && !allOptions.includes(newOption)) {
            setAllOptions([...allOptions, newOption]);
            setNewOption('');
        }
    };

    const handleURLChange = (newURLs) => {
        console.log("newURLs: ", newURLs);
        //console.log("prevURLs: ", ...prevURLs);
        setUploadURL((prevURLs) => [...prevURLs, ...newURLs]);
        setRenderUploadURL(false);
    };

    useEffect(() => {
        setRenderUploadURL(true);
    }, [uploadURL]);

    const handleSubmit = async () => {
        while (!renderUploadURL) {
            toast.error("Upload URL is not ready yet. Please try again.");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
            let eventData = {
                title,
                organiser,
                startDate,
                endDate,
                selectedCountry,
                selectedState,
                selectedCity,
                address,
                houseNumber,
                zipCode,
                description,
                peopleNeeded,
                category,
                requiredFiles,
                languages,
                uploadURL
            };

            //console.log("Event Data: ", eventData);
            const updatedEvent = await updateEvent({eventID, eventData});
            //console.log("Updated event: ", updatedEvent);
            refetch();
            setIsEditing(false);

            if (updatedEvent.error) {
                toast.error("Failed to update event. Please try again.");
            } else {
                toast.success(`${title} is updated`);
                navigate(`/events/${updatedEvent.data.response.event._id}`);
            }
        } catch (error) {
            //toast.error("Failed to update event. Please try again.");
        }
    };

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

    const handleAddReview = async () => {
        try {
            //console.log("event ID: ", eventID);
            //console.log("rating: ", rating);
            //console.log("comment: ", comment);
            const review = await createReview({eventID, userID, rating, comment});
            console.log("Review: ", review);
            toast.success('Review created successfully');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to add review. Please try again.');
        }
    };

    const handleDeleteReview = async ({reviewID}) => {
        try {
            console.log("review ID: ", reviewID);
            await deleteReview({eventID, reviewID});
            refetch();
            toast.success('Review deleted successfully');
        } catch (err) {
            console.error('Error deleting review:', err);
            toast.error('Failed to delete the review');
        }
    };

    useEffect(() => {
        setRenderUploadURL(true);
    }, [uploadURL]);

    const locationString = `${event?.response?.address} ${event?.response?.houseNumber}, ${event?.response?.zipCode} ${event?.response?.selectedCity?.name},
        ${event?.response?.selectedState?.name}, ${event?.response?.selectedCountry?.name}`;

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        setCountry(Country.getAllCountries());
        if (wishlistItems && event) {
            const isEventInWishlist = wishlistItems.some(item => item.event && item.event._id === eventID);
            setIsInWishlist(isEventInWishlist);
        }
    }, [wishlistItems, eventID, event]);

    if (isLoading) return <LoadingComponent/>;
    const isUpcoming = new Date(event?.response?.startDate) > new Date();


    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };

    const handleButtonClick = () => {
        navigate(`/application/${eventID}`);
    };

    const handleWishlistButton = async () => {
        try {
            if (isInWishlist) {
                await deleteWishList({userId: userID, eventId: eventID});
                toast.success("Event is removed from your wish list.");
            } else {
                await addWishList({userId: userID, eventId: eventID});
                toast.success("Event is added to your wish list.");
            }
            setIsInWishlist(!isInWishlist);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update your wish list.");
        }
    };


    if (error) {
        return <Typography color="error">Error loading event</Typography>;
    }


    return (
        <Container maxWidth="md" sx={{margin: '30px auto', width: {xs: '90%', md: '100%'}}}>
            <Grid container>
                <Grid item xs={12} md={10}>
                    <Box>
                        {isEditing ? (
                            <Box>
                                <Typography variant="h2">{t("eventPage.nameEvent")}</Typography>
                                <TextField
                                    required
                                    fullWidth
                                    id="eventtitle"
                                    label={t("eventPage.eventTitle")}
                                    autoFocus
                                    //placeholder="Name your event here"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    sx={{
                                        borderRadius: '30px',
                                        margin: '20px 0',
                                    }}
                                />
                            </Box>
                        ) : (
                            <Typography variant="h1" textAlign="center">{event?.response?.title}</Typography>
                        )}
                    </Box>

                    <Stack component="form" spacing={2}>
                        {event && (
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    {isEditing ? (
                                        <>
                                            <Typography variant="h2">{t("eventPage.addPictures")}</Typography>
                                            <Box sx={{marginTop: '10px'}}>
                                                <Grid item xs={12} sm={12}>
                                                    <ImageUploadBox onURLChange={handleURLChange} eventID={eventID} isEditing={isEditing}/>
                                                </Grid>
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{textAlign: 'center', marginBottom: '10px'}}>
                                            <ImageWindow uploadURL={event?.response?.uploadURL}/>
                                        </Box>
                                    )}
                                </Grid>


                                <Grid item xs={12}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">{t("eventPage.description")}</Typography>
                                    {isEditing ? (
                                        <Box sx={{marginTop: '10px'}}>
                                            <DescriptionEditor
                                                label={t("eventPage.eventDescription")}
                                                value={description}
                                                onChange={handleEditorChange}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: '15px',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            marginTop: '10px'
                                        }}>
                                            <Typography variant="body1" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(event?.response?.description)}}/>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">{t("eventPage.date")}</Typography>
                                    {isEditing ? (
                                        <Box sx={{marginTop: '10px'}}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                                    <DateTimePicker
                                                        label={t("eventPage.startDateLabel")}
                                                        value={dayjs(startDate).isValid() ? dayjs(startDate) : null}
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
                                                        label={t("eventPage.endDateLabel")}
                                                        value={dayjs(endDate).isValid() ? dayjs(endDate) : null}
                                                        minDate={dayjs()}
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
                                    ) : (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            margin: '20px 0'
                                        }}>
                                            <Stack direction="row" spacing={2}>
                                                <Box sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: '15px',
                                                    padding: '10px',
                                                    flexGrow: 1
                                                }}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{t("eventPage.startDate")}</Typography>
                                                    <Typography variant="body1">
                                                        {dayjs(event?.response?.startDate).format('YYYY-MM-DD HH:mm')}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: '15px',
                                                    padding: '10px',
                                                    flexGrow: 1
                                                }}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{t("eventPage.endDate")}</Typography>
                                                    <Typography variant="body1">
                                                        {dayjs(event?.response?.endDate).format('YYYY-MM-DD HH:mm')}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">{t("eventPage.place")}</Typography>
                                    {isEditing ? (
                                        <Stack container spacing={2} sx={{marginTop: '10px'}}>
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
                                                                    label={t("eventPage.country")}
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
                                                                    label={t("eventPage.state")}
                                                                    margin="normal"
                                                                    fullWidth
                                                                    disabled={!event.response.selectedCountry}
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
                                                                    label={t("eventPage.city")}
                                                                    margin="normal"
                                                                    fullWidth
                                                                    disabled={!event.response.selectedState}
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
                                                            label={t("eventPage.address")}
                                                            value={event.response.address}
                                                            onChange={(event) => setAddress(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            //id="house number"
                                                            //name="house number"
                                                            label={t("eventPage.houseNumber")}
                                                            value={event.response.houseNumber}
                                                            onChange={(event) => setHouseNumber(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label={t("eventPage.zipCode")}
                                                            value={event.response.zipCode}
                                                            onChange={(event) => setZipCode(event.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <Typography sx={{margin: '20px 0'}}>{locationString}</Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{width: '100%', height: {xs: '60%', md: '100%'}}}>
                                        <Map3 address={locationString}/>
                                    </Box>
                                    <Divider sx={{margin: '20px 0'}}/>
                                </Grid>

                                <Grid item xs={12}>
                                    {isEditing ? (
                                        <>
                                            <Stack direction="row">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={4}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label={t("eventPage.peopleNeeded")}
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
                                                                label={t("eventPage.category")}
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
                                            <Divider sx={{margin: '20px 0'}}/>
                                            <Typography variant="h2">{t("eventPage.selectRequiredDocuments")}</Typography>
                                            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2}}>
                                                {allOptions.map((option, index) => (
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
                                            <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
                                                <TextField
                                                    label={t("eventPage.addCustomOption")}
                                                    value={newOption}
                                                    onChange={(e) => setNewOption(e.target.value)}
                                                    fullWidth
                                                />
                                                <Button variant="contained" onClick={handleAddOption}>Add</Button>
                                            </Stack>

                                            <Box sx={{marginTop: 2}}>
                                                <Divider sx={{margin: '20px 0'}}/>
                                                <Typography variant="h2">{t("eventPage.selectWorkingLanguages")}</Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    gap: 2
                                                }}>
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
                                                <Divider sx={{margin: '20px 0'}}/>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item xs={12}>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography variant="h2" sx={{margin: '20px 0'}}>{t("eventPage.peopleNeeded")}</Typography>
                                                    <Typography variant="h3" sx={{marginLeft: 2}}>{event?.response?.peopleNeeded}</Typography>
                                                </Stack>
                                                <Divider sx={{margin: '20px 0'}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography variant="h2" sx={{margin: '20px 0'}}>{t("eventPage.category")}</Typography>
                                                    <Typography variant="h3" sx={{marginLeft: 2}}>{categoryName}</Typography>
                                                </Stack>
                                                <Divider sx={{margin: '20px 0'}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h2">
                                                    {t("eventPage.requiredDocuments")}
                                                    <Box display="flex" flexWrap="wrap" gap={2} sx={{marginTop: 2}}>
                                                        {event?.response?.requiredFiles.map((file, index) => (
                                                            <Box display="flex" alignItems="center" key={index}>
                                                                <Checkbox
                                                                    icon={<CheckBoxOutlineBlankIcon/>}
                                                                    checkedIcon={<CheckBoxIcon/>}
                                                                    checked
                                                                    sx={{padding: 0, marginRight: 1}}
                                                                />
                                                                <Typography variant="body1">{file}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Typography>
                                                <Divider sx={{margin: '20px 0'}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h2">
                                                    {t("eventPage.workingLanguages")}
                                                    <Box display="flex" flexWrap="wrap" gap={2} sx={{marginTop: 2}}>
                                                        {event?.response?.languages?.map((language, index) => (
                                                            <Box display="flex" alignItems="center" key={index}>
                                                                <Checkbox
                                                                    icon={<CheckBoxOutlineBlankIcon/>}
                                                                    checkedIcon={<CheckBoxIcon/>}
                                                                    checked
                                                                    sx={{padding: 0, marginRight: 1}}
                                                                />
                                                                <Typography variant="body1">{language}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Typography>
                                                <Divider sx={{margin: '20px 0'}}/>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h2">{t("eventPage.aboutOrganizer")}</Typography>
                                    <Box sx={{
                                        margin: '20px 0',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '15px',
                                        padding: '20px'
                                    }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Box display="flex" alignItems="center">
                                                <Avatar
                                                    src={getFileUrl(organiser.profilePicturePath, "icon", "default")}
                                                    sx={{
                                                        borderRadius: '50%',
                                                        marginRight: '10px',
                                                        width: 80,
                                                        height: 80
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="h6">{event?.response?.organiser.username}</Typography>
                                                    <Link
                                                        to={`/organizer-profile/${event?.response?.organiser._id}`}
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'primary.main',
                                                            textDecoration: 'underline',
                                                            fontWeight: 'bold',
                                                            '&:hover': {
                                                                color: 'secondary.main',
                                                                textDecoration: 'none',
                                                                backgroundColor: 'rgba(0,0,0,0.1)',
                                                                padding: '2px 4px',
                                                                borderRadius: '4px'
                                                            }
                                                        }}
                                                    >
                                                        {t("eventPage.moreInfo")}
                                                    </Link>
                                                </Box>
                                            </Box>
                                            <ChatPopupButton receiverId={event?.response?.organiser._id}/>
                                        </Stack>
                                    </Box>
                                </Grid>

                                {user?.response?.role === 'ORGANIZER' && user?.response?._id === event?.response?.organiser._id && (
                                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ display: { xs: 'block', md: 'none' } }}>
                                        {isEditing ? (
                                            <>
                                                <StyledButton variant="outlined" onClick={handleEditToggle} disabled={!isUpcoming}>
                                                    {t("eventPage.cancelEdit")}
                                                </StyledButton>
                                                <StyledButton variant="contained" onClick={handleSubmit} disabled={!isUpcoming}>
                                                    {t("eventPage.saveChanges")}
                                                </StyledButton>
                                            </>
                                        ) : (
                                            <StyledButton variant="contained" onClick={handleEditToggle} disabled={!isUpcoming}>
                                                {t("eventPage.editEvent")}
                                            </StyledButton>
                                        )}
                                    </Stack>
                                )}


                                {user?.response.role === 'VOLUNTEER' &&
                                    <>
                                        <Grid item xs={12} sx={{display: {xs: 'block', md: 'none'}}}>
                                            <Stack direction="row" justifyContent="space-around" spacing={2} sx={{padding: 2}}>
                                                {!isInWishlist &&
                                                    <StyledButton variant="outlined" onClick={handleWishlistButton} disabled={!isUpcoming}>{t("eventPage.addToWishList")}</StyledButton>}
                                                {isInWishlist &&
                                                    <StyledButton variant="outlined" onClick={handleWishlistButton}>{t("eventPage.removeFromWishlist")}</StyledButton>}
                                                <br/>
                                                <StyledButton variant="contained" onClick={handleButtonClick} disabled={!isUpcoming}>{t("eventPage.applyNow")}</StyledButton>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box component="form" onSubmit={handleAddReview} sx={{width: '100%'}}>
                                                <Box>
                                                    <Typography variant="h2">{t("eventPage.writeReview")}</Typography>
                                                    <Stack direction="row" spacing={2} sx={{margin: '10px 0'}}>
                                                        <Rating
                                                            name="star-rating"
                                                            value={rating}
                                                            onChange={handleRatingChange}
                                                            onChangeActive={(event, newHover) => {
                                                                if (newHover !== -1) setRating(newHover);
                                                            }}
                                                            precision={1}
                                                            size="large"
                                                        />
                                                        <Typography variant="subtitle1">{t("eventPage.yourRating")}: {rating}</Typography>
                                                    </Stack>
                                                </Box>
                                                <TextField
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    margin="normal"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '15px',
                                                            '& fieldset': {
                                                                borderColor: 'divider',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'divider',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'divider',
                                                            },
                                                        },
                                                    }}
                                                />
                                                <StyledButton type="submit" variant="contained" sx={{marginTop: '20px'}} onClick={handleAddReview}>{t("eventPage.submitReview")}</StyledButton>
                                            </Box>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12}>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    <Typography variant="h2">{t("eventPage.reviews")}</Typography>
                                    <Divider sx={{margin: '20px 0'}}/>
                                    {event?.response?.reviews.map((review) => (
                                        <>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Box>
                                                    <Stack direction="row" alignItems="center"
                                                           justifyContent="space-between" spacing={2}>
                                                        <Typography variant="body1" color="textSecondary">
                                                            {review?.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {review.createdAt.substring(0, 10)}
                                                        </Typography>
                                                        <Rating value={review.rating} readOnly/>
                                                    </Stack>
                                                    <Typography variant="body1"
                                                                sx={{margin: '20px 0'}}>{review.comment}</Typography>
                                                </Box>
                                                {user?.response?._id === review.user && (
                                                    <Button
                                                        variant="outlined"
                                                        sx={{borderRadius: "30px"}}
                                                        onClick={() => handleDeleteReview({reviewID: review._id})}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                )}
                                            </Stack>
                                            <Divider sx={{margin: '20px 0'}}/>
                                        </>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={2} sx={{display: {xs: 'none', md: 'block'}}}>
                    <Box>
                        <Stack direction="column" position="fixed" justifyContent="space-around" sx={{padding: 5, gap: 1}}>
                            {user?.response.role === 'VOLUNTEER' &&
                                <>
                                    {!isInWishlist &&
                                        <StyledButton variant="outlined" onClick={handleWishlistButton} disabled={!isUpcoming}>{t("eventPage.addToWishList")}</StyledButton>}
                                    {isInWishlist &&
                                        <StyledButton variant="outlined" onClick={handleWishlistButton}>{t("eventPage.removeFromWishlist")}</StyledButton>}
                                    <br/>
                                    <StyledButton variant="contained" onClick={handleButtonClick} disabled={!isUpcoming}>{t("eventPage.applyNow")}</StyledButton>
                                </>
                            }

                            {user?.response.role === 'ORGANIZER' && user?.response?._id === event?.response?.organiser._id && (
                                <>
                                    {isEditing ? (
                                        <>
                                            <StyledButton variant="outlined" onClick={handleEditToggle} disabled={!isUpcoming}>{t("eventPage.cancelEdit")}</StyledButton>
                                            <StyledButton variant="contained" onClick={handleSubmit} disabled={!isUpcoming}>{t("eventPage.saveChanges")}</StyledButton>
                                        </>
                                    ) : (
                                        <StyledButton variant="contained" onClick={handleEditToggle} disabled={!isUpcoming}>{t("eventPage.editEvent")}</StyledButton>
                                    )}
                                </>
                            )}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EventPage2;

