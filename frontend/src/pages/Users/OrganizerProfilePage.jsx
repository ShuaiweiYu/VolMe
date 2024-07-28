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
    CircularProgress,
    Alert,
    Avatar,
    Tooltip,
    IconButton,
    Autocomplete, DialogContentText, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {Country, State, City} from 'country-state-city';
import {deleteAllFile, getFileUrl, upload} from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {Link, useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {toast} from "react-toastify";
import {
    useCreateDocumentMutation,
    useDeleteDocumentMutation,
    useGetDocumentByIdQuery
} from "../../redux/documents/documentApiSlice";
import FileUploadBox from "../../components/Applications/FileUploadBox";
import PdfModal from "../../util/PdfModal";
import {useTranslation} from "react-i18next";

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const OrganizerProfilePage = ({userId}) => {
    const {data: user, isLoading, error, refetch} = useGetUserByUserIdQuery(userId);
    const [editMode, setEditMode] = useState(false);
    const [initialUserData, setInitialUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState(null);
    const [updateUser, {isLoading: isUpdating, error: updateError}] = useUpdateUserMutation();
    const [deleteUser, {isLoading: isDeleting, error: deleteError}] = useDeleteUserByIdMutation();
    const [open, setOpen] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profilePicturePath, setProfilePicturePath] = useState(null);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [presentedFiles, setPresentedFiles] = useState([])// save the uploaded files at first.
    const [createDocument] = useCreateDocumentMutation();

    const [deletedFileIds, setDeletedFileIds] = useState([]); // State to store deleted file IDs
    const {t} = useTranslation();


    const findCityByName = (countryIsoCode, stateIsoCode, cityName) => {
        const cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
        return cities.find(city => city.name === cityName);
    };

    useEffect(() => {
        if (user && user.response) {
            setInitialUserData(user.response);
            setUpdatedUserData(user.response);
            setProfilePicturePath(user.response.profilePicturePath || null); ////////
            setSelectedCountry(Country.getCountryByCode(user.response.country) || null);
            setSelectedState(State.getStateByCodeAndCountry(user.response.state, user.response.country) || null);
            setSelectedCity(findCityByName(user.response.country, user.response.state, user.response.city) || null);
        }
    }, [user]);

    useEffect(() => {
        setCountry(Country.getAllCountries());
    }, []);

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
        validateField('country', value);
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
        validateField('state', value);
    };

    const handleCityChange = (event, value) => {
        setSelectedCity(value);

        // Update updatedUser with selected city
        const updatedUser = {
            ...updatedUserData,
            city: value ? value.name : null,  // Assuming value is an object with a 'name' property
        };
        setUpdatedUserData(updatedUser);
        validateField('city', value);
    };


    const handleEditModeToggle = () => {
        if (!editMode) {
            setUpdatedUserData({...initialUserData});
        } else {
            setUpdatedUserData({...initialUserData});
            setProfilePicturePath(initialUserData.profilePicturePath || null);//////
            setProfilePictureFile(null); /////
            setSelectedCountry(Country.getCountryByCode(initialUserData.country) || null);
            setSelectedState(State.getStateByCodeAndCountry(initialUserData.state, initialUserData.country) || null);
            console.log(State.getStateByCodeAndCountry(initialUserData.state, initialUserData.country) || null);
            setSelectedCity(findCityByName(initialUserData.country, initialUserData.state, initialUserData.city) || null);
            // test
            console.log(findCityByName(initialUserData.country, initialUserData.state, initialUserData.city) || null);
            setErrors({});
        }
        setEditMode(!editMode);
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

    const handleRemoveProfilePicture = () => {
        setProfilePicturePath(null);
        setProfilePictureFile(null);
    };

    const handleFilesChange = (newFiles) => {
        setPresentedFiles(newFiles);
    };

    const handleFileDelete = (id) => {
        setPresentedFiles(prevPresentedFiles => prevPresentedFiles.filter(file => file.id !== id));
    };

    const handleUpload = async () => {
        const newUploadURLs = [];
        const uploadedFileIds = [];

        for (const file of presentedFiles) {
            try {
                const isPDF = file.type === 'application/pdf';
                const url = await upload(file.file, isPDF ? 'pdf' : 'image', user._id);
                newUploadURLs.push(url);

                // Create document model
                const result = await createDocument({
                    userId: user.response._id,
                    path: url,
                    name: file.name,
                    type: isPDF ? 'pdf' : 'image',
                    requiredFileType: file.requiredFileType
                }).unwrap();

                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(`${file.name} is uploaded.`);
                    uploadedFileIds.push(result.response._id);
                    // console.log(uploadedFileIds);
                }
            } catch (error) {
                console.error(error);
                toast.error(`Uploading ${file.type === 'application/pdf' ? 'PDF' : 'image'} failed, try again.`);
            }
        }

        return uploadedFileIds;
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
                if (value.trim() === '') {
                    error = 'Username is required';
                } else if (value.length > 20) {
                    error = 'Username cannot exceed 20 characters';
                }
                break;
            case 'organizationName':
                if (value.trim() === '') {
                    error = 'Organization name is required';
                } else if (value.length > 80) {
                    error = 'Organization name cannot exceed 80 characters';
                }
                break;
            case 'postalCode':
                if (value.trim() === '') {
                    error = 'Postal code is required';
                } else if (value.length > 10) {
                    error = 'Postal code cannot exceed 10 characters';
                }
                break;
            case 'country':
                if (value === null) {
                    error = 'Country is required';
                }
                break;
            case 'state':
                if (value === null) {
                    error = 'State is required';
                }
                break;
            case 'city':
                if (value === null) {
                    error = 'City is required';
                }
                break;
            case 'address':
                if (value.trim() === '') {
                    error = 'Address is required';
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
            // Clone the updatedUserData to avoid direct mutation
            let updatedUser = { ...updatedUserData };

            // Handle file upload and get the new file IDs
            const uploadedFileIds = await handleUpload();
            console.log("Uploaded File IDs:", uploadedFileIds);

            // Fetch existing file IDs from the initial user data
            const existingFileIds = initialUserData.files || [];

            // Filter out deleted file IDs using deletedFileIds
            const updatedFileIds = existingFileIds.filter(id => !deletedFileIds.includes(id));

            // Add uploaded file IDs to updatedFileIds
            updatedFileIds.push(...uploadedFileIds);

            // Update the user data with the combined file IDs
            updatedUser.files = updatedFileIds;
            console.log("Updated File IDs:", updatedUser.files);

            if (profilePicturePath !== initialUserData.profilePicturePath) {
                updatedUser = {...updatedUser, profilePicturePath};
            }

            console.log("user:", updatedUser);

            const {data} = await updateUser({userId: user.response._id, updateData: updatedUser}).unwrap();
            console.log(user.response._id);
            console.log('Updated User Data:', data);
            setInitialUserData(updatedUser);
            setEditMode(false);
            setErrors({});
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

    function DocumentDetails({ documentId }) {
        const { data: document, isLoading, isError } = useGetDocumentByIdQuery(documentId);
        const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

        const handleDelete = async () => {
            try {
                // Perform the deletion mutation
                await deleteDocument(documentId);
                console.log('Document deleted successfully', documentId);

                // Add the deleted document ID to deletedFileIds
                setDeletedFileIds([...deletedFileIds, documentId]);

                // Filter out the deleted document ID from initialUserData.files
                const updatedFiles = initialUserData.files.filter(file => file !== documentId);

                console.log(updatedFiles);
                // Update initialUserData with the updated files array
                setInitialUserData({
                    ...initialUserData,
                    files: updatedFiles,
                });
            } catch (error) {
                console.error('Error deleting document:', error);
                // Handle error state or show error message to the user
            }
        };

        if (isLoading) return <Typography variant="h6">Loading...</Typography>;
        if (!document) return <Typography variant="h6">Error loading document</Typography>;

        return (
            <Grid item xs={12} sm={4}>
                <PdfModal
                    title={"authentication_document"}
                    file={getFileUrl(document?.response?.path, 'pdf', 'original')}
                    renderMessage={'View Only'}
                />
                {editMode && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {t("profile.delete")}
                    </Button>
                )}
            </Grid>
        );
    }



    if (isLoading) return <CircularProgress/>;
    if (error) return <Alert severity="error">Error: {error.message}</Alert>;
    if (!user || !user.response) return <Alert severity="info">No user data found</Alert>;
    if (!initialUserData || !updatedUserData) return <CircularProgress/>;

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, position: 'relative', borderRadius: '15px', backgroundColor: '#FCFCF6', }}>
                <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
                    {t("profile.organizerProfile")}
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
                            <Tooltip title={t("profile.addPic")} placement="top">
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

                <Box sx={{marginTop: 3}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                            <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                                {t("profile.userInformation")}:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="username"
                                label={t("profile.username")}
                                variant="outlined"
                                fullWidth
                                value={editMode ? (updatedUserData.username || '') : initialUserData.username}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                error={!!errors.username}
                                helperText={errors.username}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="emailAddress"
                                label={t("profile.email")}
                                variant="outlined"
                                fullWidth
                                value={editMode ? (updatedUserData.emailAddress || '') : initialUserData.emailAddress}
                                onChange={handleInputChange}
                                disabled={true}
                                error={!!errors.emailAddress}
                                helperText={errors.emailAddress}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="organizationName"
                                label={t("profile.organizationName")}
                                variant="outlined"
                                fullWidth
                                value={editMode ? (updatedUserData.organizationName || '') : initialUserData.organizationName}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                error={!!errors.organizationName}
                                helperText={errors.organizationName}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                            <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                                {t("profile.contactAddress")}:
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
                                        error={!!errors.country}
                                        helperText={errors.country}
                                        sx={{marginTop: 0, marginBottom: 0}}
                                        required
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
                                        error={!!errors.state}
                                        helperText={errors.state}
                                        sx={{marginTop: 0, marginBottom: 0}}
                                        required
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
                                        error={!!errors.city}
                                        helperText={errors.city}
                                        sx={{marginTop: 0, marginBottom: 0}}
                                        required
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
                                error={!!errors.address}
                                helperText={errors.address}
                                required
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
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                            <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                                {t("profile.subscription")}:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="unusedPaidSubscription"
                                label={t("profile.unusedPAYG")}
                                variant="outlined"
                                fullWidth
                                value={initialUserData.unusedPaidSubscription === 0 ? '0' : initialUserData.unusedPaidSubscription}
                                onChange={handleInputChange}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="subscriptionType"
                                label={t("profile.subscriptionType")}
                                variant="outlined"
                                fullWidth
                                value={editMode ? (updatedUserData.subscriptionType || '') : initialUserData.subscriptionType}
                                onChange={handleInputChange}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Link to="/checkout" style={{textDecoration: 'none'}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!editMode}
                                    sx={{
                                        width: '200px', // Adjust the width as per your requirement
                                        marginTop: '10px',
                                        textAlign: 'center', // Align text in the middle
                                    }}
                                >
                                    {t("profile.choosePlan")}
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{mt: 0, mb: 0}}>
                            <Typography variant="h6" sx={{mb: 0, ml: 1}}>
                                {t("profile.rating")}:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="averageRating"
                                label={t("profile.averageRating")}
                                variant="outlined"
                                fullWidth
                                value={initialUserData.averageRating === -1 ? 'No rating available' : initialUserData.averageRating}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Typography variant="h6">Authentication Document: </Typography>
                            {editMode && (
                                <FileUploadBox
                                    onURLChange={handleFilesChange}
                                    onFileDelete={handleFileDelete}
                                    presentedFiles={presentedFiles}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            {/* Display PdfModal for each file */}
                            {initialUserData.files.map(documentId => (
                                <DocumentDetails key={documentId} documentId={documentId} />
                            ))}
                        </Grid>
                    </Grid>
                </Box>

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


                {updateError && <Alert severity="error">Error: {updateError.message}</Alert>}
                {deleteError && <Alert severity="error">Error: {deleteError.message}</Alert>}
            </Paper>
        </Box>
    );
};

export default OrganizerProfilePage;
