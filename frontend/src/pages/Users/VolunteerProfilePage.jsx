import React, {useState, useEffect} from 'react';
import {
    useGetUserByUserIdQuery,
    useUpdateUserMutation,
    useDeleteUserByIdMutation
} from '../../redux/users/usersApiSlice';
import {
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Box,
    Divider,
    Avatar,
    Tooltip,
    IconButton,
    Chip,
    Select,
    MenuItem, Autocomplete, DialogContentText, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ISO6391 from 'iso-639-1';
import {deleteAllFile, getFileUrl, upload} from '../../util/fileUploaderWrapper';
import ErrorComponent from '../../components/ErrorComponent';
import LoadingComponent from '../../components/LoadingComponent';
import {Link, useNavigate} from "react-router-dom";
import {City, Country, State} from "country-state-city";
import {toast, ToastContainer} from "react-toastify";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
    useGetDocumentsByUserIdQuery
} from "../../redux/documents/documentApiSlice";
import {useTranslation} from "react-i18next";

const VolunteerProfilePage = ({userId}) => {
    const {data: user, isLoading, error, refetch} = useGetUserByUserIdQuery(userId);
    const [editMode, setEditMode] = useState(false);
    const [initialUserData, setInitialUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState(null);
    const [updateUser, {isLoading: isUpdating, error: updateError}] = useUpdateUserMutation();
    const [deleteUser, {isLoading: isDeleting, error: deleteError}] = useDeleteUserByIdMutation();
    const [open, setOpen] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profilePicturePath, setProfilePicturePath] = useState(null);
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { data: documentsData, isLoading: loading, isError } = useGetDocumentsByUserIdQuery(userId);
    const {t} = useTranslation();


    const availableLanguages = ISO6391.getAllNames();
    const availableGenders = ['Male', 'Female', 'Non-binary', 'Genderqueer', 'Agender', 'Other', 'Prefer to not say'];


    // Function to find a city by name within a specific country and state
    const findCityByName = (countryIsoCode, stateIsoCode, cityName) => {
        const cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
        return cities.find(city => city.name === cityName);
    };


    useEffect(() => {
        if (user && user.response) {
            // Update initial and updated user data
            setInitialUserData(user.response);
            setUpdatedUserData(user.response);

            // Set profile picture path
            setProfilePicturePath(user.response.profilePicturePath || null);

            // Set selected country, state, and city
            setSelectedCountry(Country.getCountryByCode(user.response.country) || null);
            setSelectedState(State.getStateByCodeAndCountry(user.response.state, user.response.country) || null);
            setSelectedCity(findCityByName(user.response.country, user.response.state, user.response.city) || null);

            // Set skills and languages
            setSkills(user.response.skills || []);
            setLanguages(user.response.languages || []);
        }
    }, [user]);

    useEffect(() => {
        setCountry(Country.getAllCountries());
    }, []);

    if (isLoading) return <LoadingComponent/>;
    if (loading) return <LoadingComponent/>;
    if (error) return <ErrorComponent message={error.message}/>;
    if (!user || !user.response) return <ErrorComponent message={'No user data found'}/>;
    if (!initialUserData || !updatedUserData) return <LoadingComponent/>;


    const documents = documentsData?.response;
    console.log(documents);

    const handleCountryChange = (event, value) => {
        setSelectedCountry(value);
        setSelectedState(null);
        setSelectedCity(null);

        // Update updatedUser with selected country
        const updatedUser = {
            ...updatedUserData,
            country: value?.isoCode || null,
            state: null,
            city: null,
        };
        setUpdatedUserData(updatedUser);

        // Fetch states of selected country
        if (value) {
            const states = State.getStatesOfCountry(value.isoCode);
            setState(states);
        } else {
            setState([]);
        }
    };

    const handleStateChange = (event, value) => {
        setSelectedState(value);
        setSelectedCity(null);

        // Update updatedUser with selected state
        const updatedUser = {
            ...updatedUserData,
            state: value?.isoCode || null,
            city: null,
        };
        setUpdatedUserData(updatedUser);

        // Fetch cities of selected state
        if (selectedCountry && value) {
            const cities = City.getCitiesOfState(selectedCountry.isoCode, value.isoCode);
            setCity(cities);
        } else {
            setCity([]);
        }
    };

    const handleCityChange = (event, value) => {
        setSelectedCity(value);

        // Update updatedUser with selected city
        const updatedUser = {
            ...updatedUserData,
            city: value ? value.name : null,  // Assuming value is an object with a 'name' property
        };
        setUpdatedUserData(updatedUser);
    };


    const handleEditModeToggle = () => {
        if (!editMode) {
            // Entering edit mode
            setUpdatedUserData({...initialUserData});
        } else {
            // Exiting edit mode
            setProfilePicturePath(initialUserData.profilePicturePath || null);
            setProfilePictureFile(null);
            setSkills(initialUserData.skills || []);
            setLanguages(initialUserData.languages || []);
            setNewSkill('');
            setNewLanguage('');
            setSelectedCountry(Country.getCountryByCode(initialUserData.country) || null);
            setSelectedState(State.getStateByCodeAndCountry(initialUserData.state, initialUserData.country) || null);
            console.log(State.getStateByCodeAndCountry(initialUserData.state, initialUserData.country) || null);
            setSelectedCity(findCityByName(initialUserData.country, initialUserData.state, initialUserData.city) || null);
            // test
            console.log(findCityByName(initialUserData.country, initialUserData.state, initialUserData.city) || null);
            setErrors({});
        }
        setEditMode(!editMode); // Toggle edit mode
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
        validateField(name, value);
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await deleteAllFile(initialUserData.profilePicturePath)
                const url = await upload(file, "icon", user.response._id); // Upload the file
                setProfilePicturePath(url); // Set the URL received from the upload
                const reader = new FileReader();
                reader.onload = () => {
                    setProfilePictureFile(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'emailAddress':
                if (!validateEmail(value)) {
                    error = 'Invalid email format';
                } else if (value.length > 50) {
                    error = 'Email cannot exceed 50 characters';
                }
                break;
            case 'username':
                if (value.length > 20) {
                    error = 'Username cannot exceed 20 characters';
                }
                break;
            case 'firstname':
                if (value.trim() === '') {
                    error = 'First name is required';
                } else if (value.length > 30) {
                    error = 'First name cannot exceed 30 characters';
                }
                break;
            case 'lastname':
                if (value.trim() === '') {
                    error = 'Last name is required';
                } else if (value.length > 30) {
                    error = 'Last name cannot exceed 30 characters';
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleSaveChanges = async () => {
        const hasErrors = Object.values(errors).some((error) => error);
        if (hasErrors) {
            alert('Please correct the errors before saving.');
            return;
        }

        try {
            let updatedUser = {...updatedUserData};

            if (profilePicturePath !== initialUserData.profilePicturePath) {
                updatedUser = {...updatedUser, profilePicturePath};
            }

            const {data} = await updateUser({userId: user.response?._id, updateData: updatedUser});
            console.log('Updated User Data:', data);
            setInitialUserData(updatedUser);
            setEditMode(false);
            setErrors({});
            await refetch();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (!user?.response?._id) {
            console.error('User ID not found');
            return;
        }
        try {
            await deleteUser(user.response._id).unwrap();
            // Handle successful deletion (e.g., redirect to another page)
            console.log('User deleted:', user.response._id);
            navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            handleClose();
        }
    };

    const handleAddSkill = () => {
        if (newSkill) {
            const updatedSkills = [...skills, newSkill];
            setSkills(updatedSkills);
            setNewSkill('');
            setUpdatedUserData({
                ...updatedUserData,
                skills: updatedSkills,
            });
        }
    };


    const handleAddLanguage = () => {
        if (newLanguage) {
            // Check if the new language already exists in the languages array
            if (languages.includes(newLanguage)) {
                toast.warning(`Language '${newLanguage}' already exists.`);
                return;
            }

            // Update languages state
            const updatedLanguages = [...languages, newLanguage];
            setLanguages(updatedLanguages);
            setNewLanguage('');

            // Update updatedUserData with new languages
            setUpdatedUserData({
                ...updatedUserData,
                languages: updatedLanguages,
            });
        }
    };


    const handleDeleteSkill = (skillToDelete) => {
        const updatedSkills = skills.filter((skill) => skill !== skillToDelete);
        setSkills(updatedSkills);
        setUpdatedUserData({
            ...updatedUserData,
            skills: updatedSkills,
        });
    };

    const handleDeleteLanguage = (languageToDelete) => {
        const updatedLanguages = languages.filter((language) => language !== languageToDelete);
        setLanguages(updatedLanguages);
        setUpdatedUserData({
            ...updatedUserData,
            languages: updatedLanguages,
        });
    };

    const handleRemoveProfilePicture = () => {
        setProfilePicturePath(null);
        setProfilePictureFile(null);
    };


    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, position: 'relative', borderRadius: '15px', backgroundColor: '#FCFCF6', }}>
                <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
                    {t("profile.volunteerProfile")}
                </Typography>

                <Box mb={2}>
                    <Divider/>
                </Box>

                {/* Profile Picture */}
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                >
                    <Avatar
                        src={getFileUrl(profilePicturePath, 'icon', 'display')}
                        sx={{width: 120, height: 120}}
                    >
                        <PersonIcon/>
                    </Avatar>

                    {editMode && (
                        <Box sx={{marginTop: 1}}>
                            <Tooltip title= {t("profile.addPic")} placement="top">
                                <IconButton component="label">
                                    <EditIcon fontSize="medium" sx={{backgroundColor: 'white', borderRadius: '50%'}}/>
                                    <input type="file" accept="image/*" style={{display: 'none'}}
                                           onChange={handleProfilePictureChange}/>
                                </IconButton>
                            </Tooltip>

                            {profilePicturePath && (
                                <Tooltip title={t("profile.removePic")} placement="top">
                                    <IconButton onClick={handleRemoveProfilePicture}>
                                        <DeleteIcon fontSize="medium"/>
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                        <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                            {t("profile.userInformation")}:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="firstname"
                            label={t("profile.firstname")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? updatedUserData.firstname || '' : initialUserData.firstname}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="lastname"
                            label={t("profile.lastname")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? updatedUserData.lastname || '' : initialUserData.lastname}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {editMode ? (
                            <Select
                                name="gender"
                                value={updatedUserData.gender || ''}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>{t("profile.selectGender")}</em>
                                </MenuItem>
                                {availableGenders.map((gender, index) => (
                                    <MenuItem key={index} value={gender}>
                                        {gender}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <TextField
                                name="gender"
                                label={t("profile.gender")}
                                variant="outlined"
                                fullWidth
                                value={initialUserData.gender || ''}
                                disabled={true}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box>
                                <DatePicker
                                    label={t("profile.birthday")}
                                    value={
                                        editMode
                                            ? dayjs(updatedUserData.birthday) || null
                                            : dayjs(initialUserData.birthday) || null
                                    }
                                    onChange={(date) =>
                                        handleInputChange({
                                            target: {
                                                name: 'birthday',
                                                value: dayjs(date).format('YYYY-MM-DD'),
                                            },
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" fullWidth disabled={!editMode}/>
                                    )}
                                    inputFormat="YYYY-MM-DD"
                                    maxDate={dayjs()} // Ensure only past dates can be selected
                                    sx={{width: '100%'}} // Adjust width as needed
                                    disabled={!editMode}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="emailAddress"
                            label={t("profile.email")}
                            variant="outlined"
                            fullWidth
                            value={
                                editMode
                                    ? updatedUserData.emailAddress || ''
                                    : initialUserData.emailAddress
                            }
                            onChange={handleInputChange}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="phoneNumber"
                            label={t("profile.phoneNumber")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? updatedUserData.phoneNumber || '' : initialUserData.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!editMode}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="username"
                            label={t("profile.username")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? updatedUserData.username || '' : initialUserData.username}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            name="participationCount"
                            label={t("profile.count")}
                            variant="outlined"
                            fullWidth
                            value={
                                editMode
                                    ? updatedUserData.participationCount ?? 0
                                    : initialUserData.participationCount ?? 0
                            }
                            onChange={handleInputChange}
                            disabled={true}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                        <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                            Contact Address:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={country}
                            getOptionLabel={(option) => option.name}
                            value={selectedCountry}
                            disabled={!editMode}
                            onChange={handleCountryChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("profile.country")}
                                    margin="normal"
                                    fullWidth
                                    value={editMode ? (updatedUserData.country || '') : initialUserData.country}
                                    disabled={!editMode}
                                    sx={{marginTop: 0, marginBottom: 0}}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={state}
                            getOptionLabel={(option) => option.name}
                            value={selectedState}
                            disabled={!editMode}
                            onChange={handleStateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("profile.state")}
                                    margin="normal"
                                    fullWidth
                                    value={editMode ? (updatedUserData.state || '') : initialUserData.state}
                                    disabled={!editMode}
                                    sx={{marginTop: 0, marginBottom: 0}}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={city}
                            getOptionLabel={(option) => option.name}
                            value={selectedCity}
                            disabled={!editMode}
                            onChange={handleCityChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("profile.city")}
                                    margin="normal"
                                    fullWidth
                                    value={editMode ? (updatedUserData.city || '') : initialUserData.city}
                                    disabled={!editMode}
                                    sx={{marginTop: 0, marginBottom: 0}}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            name="address"
                            label={t("profile.address")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? (updatedUserData.address || '') : initialUserData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="postalCode"
                            label={t("profile.postalCode")}
                            variant="outlined"
                            fullWidth
                            value={editMode ? (updatedUserData.postalCode || '') : initialUserData.postalCode}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!errors.postalCode}
                            helperText={errors.postalCode}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{mt: 1}}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h6" sx={{marginLeft: '5px'}}>{t("profile.skills")}:</Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
                                {skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={editMode ? () => handleDeleteSkill(skill) : undefined}
                                    />
                                ))}
                            </Box>
                            {editMode && (
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <TextField
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        placeholder={t("profile.addSkill")}
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={handleAddSkill}>
                                        {t("profile.add")}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h6" sx={{marginLeft: '5px'}}>{t("profile.languages")}:</Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
                                {languages.map((language, index) => (
                                    <Chip
                                        key={index}
                                        label={language}
                                        onDelete={editMode ? () => handleDeleteLanguage(language) : undefined}
                                    />
                                ))}
                            </Box>
                            {editMode && (
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <Select
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                        displayEmpty
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em> {t("profile.addLanguage")}</em>
                                        </MenuItem>
                                        {availableLanguages.map((language, index) => (
                                            <MenuItem key={index} value={language}>
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Button variant="contained" onClick={handleAddLanguage}>
                                        {t("profile.add")}
                                    </Button>
                                </Box>
                            )}
                            <ToastContainer position="bottom-right" autoClose={3000}/>
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    mt={3}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {!editMode ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleEditModeToggle}>
                                {t("profile.edit")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveChanges}
                                    disabled={isUpdating}
                                    sx={{mr: 2}}
                                >
                                    {t("profile.save")}
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleEditModeToggle}>
                                    {t("profile.cancel")}
                                </Button>
                            </Box>
                        </>
                    )}
                    <Grid item xs={12} sm={6}>
                        <Link to="/reset-password" style={{textDecoration: 'none'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={false}
                                sx={{marginTop: '10px'}}
                            >
                                {t("profile.resetPassword")}
                            </Button>
                        </Link>
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        disabled={isDeleting}
                        sx={{
                            backgroundColor: 'white',
                            color: 'error.main',
                            border: '1px solid',
                            borderColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white',
                            },
                        }}
                    >
                        {t("profile.deleteAccount")}
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{t("profile.confirmDeletion")}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {t("profile.confirmDeletionMes")}
                            </DialogContentText>
                            {deleteError && <p style={{color: 'red'}}>Error deleting user: {deleteError.message}</p>}
                        </DialogContent>
                        <DialogActions sx={{paddingBottom: '24px'}}>
                            <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, width: '100%'}}>
                                <Button variant="outlined" color="primary" sx={{fontWeight: 'bold', width: '100px'}}
                                        onClick={handleClose}>
                                    {t("profile.cancel")}
                                </Button>
                                <Button variant="outlined" color="error" autoFocus
                                        sx={{fontWeight: 'bold', width: '100px'}} onClick={handleDeleteAccount}>
                                    {t("profile.delete")}
                                </Button>
                            </Box>
                        </DialogActions>
                    </Dialog>
                </Box>

                {updateError && (
                    <Box mt={3}>
                        <ErrorComponent message={updateError.message}/>
                    </Box>
                )}

                {deleteError && (
                    <Box mt={3}>
                        <ErrorComponent message={deleteError.message}/>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default VolunteerProfilePage;