import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {
    styled,
    Stack,
    Button,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Link,
    FormHelperText,
    Avatar,
    Typography,
    Alert, Box, IconButton
} from '@mui/material';
import {
    SentimentSatisfiedAlt,
    Visibility,
    VisibilityOff,
    DriveFolderUpload,
} from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import LoginIcon from '@mui/icons-material/Login';
import CircularProgress from "@mui/material/CircularProgress";
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {upload} from '../../util/fileUploaderWrapper'

import organizerIcon from '../../Assets/community.png';
import volunteerIcon from '../../Assets/vest.png';

import {useLoginMutation} from '../../redux/auth/authApiSlice'
import {setCredentials} from '../../redux/auth/authSlice'

import {
    useAddNewVolunteerMutation,
    useAddNewOrganizerMutation,
    useLazyGetUserByEmailAddressQuery,
    useUpdateUserMutation,
    useValidateUserMutation
} from "../../redux/users/usersApiSlice";
import {useAddNewCodeMutation, useCheckCodeValidityMutation} from "../../redux/codes/codesApiSlice"
import {useSendRegistrationConfirmationEmailMutation} from "../../redux/emails/emailsApiSlice"
import Grid from "@mui/material/Grid";
import {City, Country, State} from "country-state-city";
import Autocomplete from '@mui/material/Autocomplete';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const Step1 = ({
                   role,
                   setRole,
                   email,
                   setEmail,
                   emailError,
                   setEmailError,
                   password,
                   setPassword,
                   confirmPassword,
                   setConfirmPassword
               }) => {

    const {t} = useTranslation();

    const RoleButton = styled(Button)(({selected}) => ({
        backgroundColor: selected ? '#51BC51' : 'transparent',
        color: selected ? '#fff' : '#000',
        '&:hover': {
            backgroundColor: selected ? '#136C13' : 'rgba(25, 118, 210, 0.04)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        margin: '0 10px',
    }));

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [password1Error, setPassword1Error] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        if (!validateEmail(newEmail)) {
            setEmailError(t('credentials.login.invalidEmail'));
        } else if (newEmail.length > 50) {
            setEmailError(t('credentials.login.emailTooLong'));
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        if (newPassword.length < 8) {
            setPassword1Error(t('credentials.signUp.passwordTooShort'));
        } else if (newPassword.length > 50) {
            setPassword1Error(t('credentials.signUp.passwordTooLong'));
        } else {
            if (confirmPassword && newPassword !== confirmPassword) {
                setPassword1Error(t('credentials.signUp.passwordNotMatch'));
            } else {
                setPassword1Error('');
            }
        }
    };


    const handleConfirmPasswordChange = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);

        if (password && newConfirmPassword !== password) {
            setPasswordError(t('credentials.signUp.passwordNotMatch'));
        } else {
            setPasswordError('');
        }
    };


    return (
        <Box sx={{width: '80%', margin: 'auto'}}>
            <Typography sx={{textAlign: 'center', marginBottom: '10px'}}>
                {t('credentials.signUp.step1intro')}
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <RoleButton variant="outlined" selected={role === 'volunteer'} onClick={() => setRole('volunteer')}>
                    <img
                        src={volunteerIcon}
                        alt="volunteerIcon"
                        style={{height: '80px', width: '80px'}}
                    />
                    <Typography>
                        {t('credentials.signUp.step1Volunteer')}
                    </Typography>
                </RoleButton>
                <RoleButton variant="outlined" selected={role === 'organizer'} onClick={() => setRole('organizer')}>
                    <img
                        src={organizerIcon}
                        alt="organizerIcon"
                        style={{height: '80px', width: '80px'}}
                    />
                    <Typography>
                        {t('credentials.signUp.step1Organizer')}
                    </Typography>
                </RoleButton>
            </Box>

            <Typography sx={{textAlign: 'center', marginTop: '20px'}}>
                {t('credentials.signUp.step1SetUp')}
            </Typography>

            <TextField
                id="outlined-email"
                label={t('credentials.signUp.step1Email')}
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                required
                margin="normal"
                sx={{marginTop: '10px'}}
            />

            <FormControl variant="outlined" fullWidth margin="normal" error={!!password1Error} required sx={{marginTop: '10px'}}>
                <InputLabel htmlFor="outlined-password">{t('credentials.signUp.step1Password')}</InputLabel>
                <OutlinedInput
                    id="outlined-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={t('credentials.signUp.step1Password')}
                    required
                />
                {password1Error && <FormHelperText>{password1Error}</FormHelperText>}
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal" error={!!passwordError} required
                         sx={{marginTop: '10px'}}>
                <InputLabel
                    htmlFor="outlined-confirm-password">{t('credentials.signUp.step1ConfirmPassword')}</InputLabel>
                <OutlinedInput
                    id="outlined-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={t('credentials.signUp.step1ConfirmPassword')}
                    required
                />
                {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
            </FormControl>
        </Box>
    )
}

const ProfileAvatar = ({
                           profilePicture,
                           setProfilePicture,
                           setIcon
                       }) => {
    const {t} = useTranslation();

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        setIcon(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <input
                accept="image/*"
                style={{display: 'none'}}
                id="upload-profile-picture"
                type="file"
                onChange={handleProfilePictureChange}
            />
            <label htmlFor="upload-profile-picture">
                <IconButton
                    component="span"
                    disableRipple
                >

                    <Stack alignItems="center" spacing={0}>
                        <Avatar
                            src={profilePicture}
                            alt="Profile Picture"
                            sx={{
                                width: 100,
                                height: 100,
                                margin: '5px auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {!profilePicture && <SentimentSatisfiedAlt fontSize="large"/>}
                        </Avatar>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <DriveFolderUpload/>
                            <Typography
                                sx={{
                                    fontSize: '10px',
                                    color: 'darkgrey'
                                }}
                            >
                                {t('credentials.signUp.step2uploadProfile')}
                            </Typography>
                        </Stack>
                    </Stack>
                </IconButton>
            </label>
        </Box>
    )
}

const Step2ForVolunteer = ({
                               profilePicture,
                               setProfilePicture,
                               setIcon,
                               username,
                               setUsername,
                               firstName,
                               setFirstName,
                               lastName,
                               setLastName,
                               phoneNumber,
                               setPhoneNumber,
                               birthday,
                               setBirthday
                           }) => {
    const {t} = useTranslation();
    const [usernameError, setUsernameError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');

    const handleUsernameChange = (event) => {
        const username = event.target.value;
        setUsername(username);

        if (username.length > 20) {
            setUsernameError(t('credentials.signUp.usernameTooLong'));
        } else {
            setUsernameError('');
        }
    };

    const handleFirstnameChange = (event) => {
        const firstname = event.target.value;
        setFirstName(firstname);

        if (firstname.length > 30) {
            setFirstnameError(t('credentials.signUp.nameTooLong'));
        } else {
            setFirstnameError('');
        }
    };

    const handleLastnameChange = (event) => {
        const lastname = event.target.value;
        setLastName(lastname);

        if (lastname.length > 30) {
            setLastnameError(t('credentials.signUp.nameTooLong'));
        } else {
            setLastnameError('');
        }
    };

    const handlePhoneNumberChange = (event) => {
        const newPhoneNumber = event.target.value;
        const phoneNumberPattern = /^[+]?[\d\s]{0,20}$/;

        if (phoneNumberPattern.test(newPhoneNumber)) {
            setPhoneNumber(newPhoneNumber);
        }
    };

    const FullWidthDatePicker = styled(DatePicker)(({theme}) => ({
        width: '100%',
        margin: theme.spacing(1, 0),
    }));

    return (
        <Box sx={{textAlign: 'center', marginBottom: '10px'}}>
            <ProfileAvatar profilePicture={profilePicture} setProfilePicture={setProfilePicture} setIcon={setIcon}/>

            <Stack spacing={2} style={{marginTop: '10px'}}>
                <TextField
                    id="outlined-volunteer-username"
                    label={t('credentials.signUp.step2VolunteerUsername')}
                    variant="outlined"
                    fullWidth
                    value={username}
                    error={!!usernameError}
                    helperText={usernameError}
                    onChange={handleUsernameChange}
                    required
                    margin="normal"
                />

                <Stack direction="row" spacing={2} justifyContent="center">
                    <TextField
                        id="outlined-first-name"
                        label={t('credentials.signUp.step2VolunteerFirstName')}
                        variant="outlined"
                        fullWidth
                        value={firstName}
                        error={!!firstnameError}
                        helperText={firstnameError}
                        onChange={handleFirstnameChange}
                        required
                    />
                    <TextField
                        id="outlined-last-name"
                        label={t('credentials.signUp.step2VolunteerLastName')}
                        variant="outlined"
                        fullWidth
                        value={lastName}
                        error={!!lastnameError}
                        helperText={lastnameError}
                        onChange={handleLastnameChange}
                        required
                    />
                </Stack>

                <TextField
                    id="outlined-phone-number"
                    label={t('credentials.signUp.step2PhoneNumber')}
                    variant="outlined"
                    fullWidth
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    margin="normal"
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FullWidthDatePicker
                        label={t('credentials.signUp.step2VolunteerBirthday')}
                        value={birthday}
                        maxDate={dayjs(new Date())}
                        onChange={(newValue) => setBirthday(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                    />
                </LocalizationProvider>
            </Stack>
        </Box>
    );
};

const Step2ForOrganizer = ({
                               profilePicture,
                               setProfilePicture,
                               setIcon,
                               username,
                               setUsername,
                               phoneNumber,
                               setPhoneNumber,
                               address,
                               setAddress,
                               postalCode,
                               setPostalCode,
                               selectedCountry,
                               setSelectedCountry,
                               selectedState,
                               setSelectedState,
                               selectedCity,
                               setSelectedCity
                           }) => {
    const { t } = useTranslation();
    const [usernameError, setUsernameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const country = useMemo(() => Country.getAllCountries(), []);

    useEffect(() => {
        if (selectedCountry) {
            setState(State.getStatesOfCountry(selectedCountry.isoCode));
            setCity([]);
        } else {
            setState([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            setCity(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
        } else {
            setCity([]);
        }
    }, [selectedState, selectedCountry]);

    const handlePhoneNumberChange = (event) => {
        const newPhoneNumber = event.target.value;
        const phoneNumberPattern = /^[+]?[\d\s]{0,20}$/;

        if (phoneNumberPattern.test(newPhoneNumber)) {
            setPhoneNumber(newPhoneNumber);
        }
    };

    const handleUsernameChange = (event) => {
        const username = event.target.value;
        setUsername(username);

        if (username.length > 80) {
            setUsernameError(t('credentials.signUp.orgTooLong'));
        } else {
            setUsernameError('');
        }
    };

    const handleAddressChange = (event) => {
        const address = event.target.value;
        setAddress(address);

        if (address.length > 50) {
            setAddressError(t('credentials.signUp.addressTooLong'));
        } else {
            setAddressError('');
        }
    };

    const handlePostalCodeChange = (event) => {
        const code = event.target.value;
        setPostalCode(code);

        if (code.length > 10) {
            setPostalCodeError(t('Postal code cannot exceed 10 characters'));
        } else {
            setPostalCodeError('');
        }
    };

    const handleCountryChange = (event, value) => {
        setSelectedCountry(value);
        setSelectedState(null);
        setSelectedCity(null);
    };

    const handleStateChange = (event, value) => {
        setSelectedState(value);
        setSelectedCity(null);
    };

    const handleCityChange = (event, value) => {
        setSelectedCity(value);
    };

    return (
        <Box sx={{ textAlign: 'center', marginBottom: '10px', width: '100%' }}>
            <ProfileAvatar profilePicture={profilePicture} setProfilePicture={setProfilePicture} setIcon={setIcon} />

            <Stack spacing={2} style={{ marginTop: '10px' }}>
                <TextField
                    id="outlined-organizer-username"
                    label={t('credentials.signUp.step2OrganizerUsername')}
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleUsernameChange}
                    error={!!usernameError}
                    helperText={usernameError}
                    required
                    margin="normal"
                    autoComplete="new-password"
                />

                <Stack direction="row">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                includeInputInList={false}
                                options={country}
                                getOptionLabel={(option) => option.name}
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Country"
                                        margin="normal"
                                        fullWidth
                                        required
                                    />
                                )}
                                style={{ margin: 'normal' }}
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
                                        label="State / Province"
                                        margin="normal"
                                        fullWidth
                                        disabled={!selectedCountry}
                                        required
                                    />
                                )}
                                style={{ margin: 'normal' }}
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
                                        label="City"
                                        margin="normal"
                                        fullWidth
                                        disabled={!selectedState}
                                        required
                                    />
                                )}
                                style={{ margin: 'normal' }}
                            />
                        </Grid>
                    </Grid>
                </Stack>

                <TextField
                    id="outlined-organizer-address"
                    label={t('credentials.signUp.step2OrganizerAddress')}
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={handleAddressChange}
                    error={!!addressError}
                    helperText={addressError}
                    required
                    margin="normal"
                    autoComplete="address-line1"
                />

                <TextField
                    id="outlined-organizer-postcode"
                    name="postalCode"
                    label="Postal Code"
                    variant="outlined"
                    fullWidth
                    required
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    error={!!postalCodeError}
                    helperText={postalCodeError}
                />

                <TextField
                    id="outlined-phone-number"
                    label={t('credentials.signUp.step2PhoneNumber')}
                    variant="outlined"
                    fullWidth
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    margin="normal"
                />
            </Stack>
        </Box>
    );
};

// const Step3 = ({code, setCode, codeCheckError, resendCode}) => {
//     const {t} = useTranslation();
//     const [isCooldown, setIsCooldown] = useState(false);
//     const [seconds, setSeconds] = useState(60);
//
//     const StyledLink = styled(Link)(({theme, disabled}) => {
//         const grey500 = theme.palette.grey ? theme.palette.grey[500] : '#9e9e9e'; // 默认灰色值
//         const primaryColor = theme.palette.primary ? theme.palette.primary.main : '#1976d2'; // 默认主色值
//
//         return {
//             cursor: disabled ? 'not-allowed' : 'pointer',
//             color: disabled ? grey500 : primaryColor,
//             pointerEvents: disabled ? 'none' : 'auto',
//             textDecoration: 'none',
//             '&:hover': {
//                 textDecoration: disabled ? 'none' : 'underline',
//             },
//         };
//     });
//
//     useEffect(() => {
//         let timer;
//         if (isCooldown) {
//             timer = setInterval(() => {
//                 setSeconds((prevSeconds) => {
//                     if (prevSeconds <= 1) {
//                         clearInterval(timer);
//                         setIsCooldown(false);
//                         return 60;
//                     }
//                     return prevSeconds - 1;
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [isCooldown]);
//
//     const handleResendCode = () => {
//         if (!isCooldown) {
//             resendCode();
//             setIsCooldown(true);
//         }
//     };
//
//     return (
//         <Box>
//             <Typography>
//                 {t('credentials.signUp.step3info')}
//             </Typography>
//             <TextField
//                 id="outlined-organizer-username"
//                 label={t('credentials.signUp.step3label')}
//                 variant="outlined"
//                 fullWidth
//                 value={code}
//                 onChange={(event) => setCode(event.target.value)}
//                 required
//                 margin="normal"
//             />
//             {codeCheckError && (
//                 <Typography color="error">
//                     {t('credentials.signUp.codeCheckError')}
//                 </Typography>
//             )}
//             <Typography>
//                 {t('credentials.signUp.resendInfo')}
//             </Typography>
//             <StyledLink onClick={handleResendCode} disabled={isCooldown}>
//                 <span>{t('credentials.signUp.resend')}</span>
//             </StyledLink>
//             {isCooldown && (
//                 <Typography>
//                     {t('credentials.signUp.resendCooldown')} {seconds} {t('credentials.signUp.seconds')}
//                 </Typography>
//             )}
//         </Box>
//     );
// };

const Step4 = ({handleClose, handleLogin}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const handleAsyncLogin = async () => {
            try {
                await handleLogin();
                handleClose();
                navigate('/profile');
            } catch (error) {
            }
        };

        const timeout = setTimeout(() => {
            handleAsyncLogin();
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, [navigate, handleClose, handleLogin]);

    return (
        <Box>
            <Typography variant="h6">{t('credentials.signUp.allSet')}</Typography>
            <Typography variant="body1">
                {t('credentials.signUp.redirecting')} {countdown} {t('credentials.signUp.seconds')}
            </Typography>
        </Box>
    )
}

// todo: 加宽一点，第二步太窄了
export const SignUpModal = ({handleClose}) => {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    // common information set up
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('noUrlPath');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [id, setId] = useState('');
    const [icon, setIcon] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // volunteer information set up
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState(null);

    // organizer information setup
    const [address, setAddress] = useState('')
    const [postCode, setPostCode] = useState('')

    // code check information
    const [codeCheckError, setCodeCheckError] = useState('')
    const [code, setCode] = useState('')

    const dispatch = useDispatch()

    const [validateUser] = useValidateUserMutation()

    const [addNewVolunteer, {
        isLoading: isAddNewVolunteerLoading
    }] = useAddNewVolunteerMutation()

    const [addNewOrganizer, {
        isLoading: isAddNewOrganizerLoading
    }] = useAddNewOrganizerMutation()

    const [getUserByEmailAddress, {
        isLoading: isGetUserByEmailAddressLoading,
    }] = useLazyGetUserByEmailAddressQuery()

    const [addNewCode] = useAddNewCodeMutation()

    const [checkCode, {
        isLoading: isCheckCodeLoading
    }] = useCheckCodeValidityMutation()

    const [sendCode] = useSendRegistrationConfirmationEmailMutation()

    const [login, {isLoading}] = useLoginMutation()

    const [updateUser] = useUpdateUserMutation()

    const isStep1Valid = validateEmail(email) && password && (password === confirmPassword) && password.length <= 50 && role;

    const isStep2Valid = () => {
        if (role === 'volunteer') {
            return !!(username && firstName && lastName && birthday && firstName.length <= 30 && lastName.length <= 30 && username.length <= 20);
        } else {
            return !!(username && address && username.length <= 80 && address.length <= 50 && selectedCity && selectedState && selectedCountry && postCode && postCode.length <= 10)
        }
    }
    
    // const steps = [t('credentials.signUp.stepInfo1'), t('credentials.signUp.stepInfo2'), t('credentials.signUp.stepInfo3')];
    const steps = [t('credentials.signUp.stepInfo1'), t('credentials.signUp.stepInfo2')];

    const handleNextAndCheckEmail = async (event) => {
        event.preventDefault();

        const user = await getUserByEmailAddress(email)
        if (user.data?.status === 200) {
            setEmailError(t('credentials.signUp.signUpErrorDuplication'))
            alert(t('credentials.signUp.signUpErrorDuplication'))
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    const handleBack = (event) => {
        event.preventDefault();
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSignUp(event)
    };

    const handleSignUp = async (event) => {
        let user;
        if (role === 'volunteer') {
            user = await addNewVolunteer({
                emailAddress: email,
                username: username,
                password: password,
                profilePicturePath: "null",
                phoneNumber: phoneNumber,
                firstname: firstName,
                lastname: lastName,
                birthday: birthday
            });
        } else {
            user = await addNewOrganizer({
                emailAddress: email,
                username: username,
                password: password,
                profilePicturePath: "null",
                phoneNumber: phoneNumber,
                address: address,
                postalCode: postCode,
                country: selectedCountry.name,
                state: selectedState.name,
                city: selectedCity.name
            });
        }

        if (user.data?.status === 201) {
            setId(user.data.response._id)
            // const codeResponse = await addNewCode({userId: user.data.response._id, usage: "REGISTRATION"})
            // const sendCodeResponse = await sendCode({
            //     userId: user.data.response._id,
            //     usage: "REGISTRATION",
            //     username: username,
            //     user_email_address: email
            // })
            alert(t('credentials.signUp.signUpSuccess'))
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            alert(t('credentials.signUp.signUpError'))
        }
    }

    // const handleCheckCode = async (event) => {
    //     const result = await checkCode({userId: id, usage: "REGISTRATION", inputValue: code})
    //     if (result.data?.status === 200) {
    //         await validateUser({userId: id, updateData: {isValidUser: true}});
    //         setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     } else {
    //         setCodeCheckError(t('credentials.signUp.codeCheckError'))
    //     }
    // }

    // const resendCode = async () => {
    //     const codeResponse = await addNewCode({userId: id, usage: "REGISTRATION"})
    //     const sendCodeResponse = await sendCode({
    //         userId: id,
    //         usage: "REGISTRATION",
    //         username: username,
    //         user_email_address: email
    //     })
    // }

    const handleLogin = async () => {
        try {
            const loginData = await login({emailAddress: email, password: password})
            if (loginData.data?.status === 200) {
                dispatch(setCredentials({
                    accessToken: loginData.data.response.accessToken,
                    userId: loginData.data.response.userId,
                    role: loginData.data.response.role
                }))
                const url = await upload(icon, "icon", id)
                updateUser({userId: id, updateData: {profilePicturePath: url}})
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 1000,
                maxWidth: 2000,
                padding: 2,
                margin: '10px auto'
            }}
        >
            <Stack>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Divider style={{marginTop: "10px"}}/>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={1} alignItems="center">
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            {activeStep === 0 && <Step1
                                role={role}
                                setRole={setRole}
                                email={email}
                                setEmail={setEmail}
                                emailError={emailError}
                                setEmailError={setEmailError}
                                password={password}
                                setPassword={setPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                            />}

                            {activeStep === 1 && (role === 'volunteer' ?
                                <Step2ForVolunteer
                                    profilePicture={profilePicture}
                                    setProfilePicture={setProfilePicture}
                                    setIcon={setIcon}
                                    username={username}
                                    setUsername={setUsername}
                                    firstName={firstName}
                                    setFirstName={setFirstName}
                                    lastName={lastName}
                                    setLastName={setLastName}
                                    phoneNumber={phoneNumber}
                                    setPhoneNumber={setPhoneNumber}
                                    birthday={birthday}
                                    setBirthday={setBirthday}
                                />
                                :
                                <Step2ForOrganizer
                                    profilePicture={profilePicture}
                                    setProfilePicture={setProfilePicture}
                                    setIcon={setIcon}
                                    username={username}
                                    setUsername={setUsername}
                                    phoneNumber={phoneNumber}
                                    setPhoneNumber={setPhoneNumber}
                                    address={address}
                                    setAddress={setAddress}
                                    selectedCountry={selectedCountry}
                                    setSelectedCountry={setSelectedCountry}
                                    selectedState={selectedState}
                                    setSelectedState={setSelectedState}
                                    selectedCity={selectedCity}
                                    setSelectedCity={setSelectedCity}
                                    postalCode={postCode}
                                    setPostalCode={setPostCode}
                                />)}

                            {/*{activeStep === 2 && <Step3*/}
                            {/*    code={code}*/}
                            {/*    setCode={setCode}*/}
                            {/*    codeCheckError={codeCheckError}*/}
                            {/*    resendCode={resendCode}*/}
                            {/*/>}*/}

                            {activeStep === 2 && <Step4 handleClose={handleClose} handleLogin={handleLogin}/>}

                            {/*{activeStep === 3 && <Step4 handleClose={handleClose} handleLogin={handleLogin}/>}*/}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            marginTop: '10px',
                            justifyContent: activeStep > 0 ? 'space-between' : 'center',
                            width: '100%'
                        }}>
                            {activeStep === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={handleNextAndCheckEmail}
                                    type="button"
                                    disabled={!isStep1Valid}
                                    sx={{
                                        maxWidth: 300,
                                        width: '100%'
                                    }}
                                    endIcon={isGetUserByEmailAddressLoading ?
                                        <CircularProgress size={24} style={{color: 'white'}}/> :
                                        <ArrowForwardIosIcon/>}
                                >
                                    {t('credentials.signUp.nextButton')}
                                </Button>
                            )}

                            {activeStep === 1 && (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={handleBack}
                                        type="button"
                                        sx={{
                                            maxWidth: 200,
                                            width: '48%'
                                        }}
                                        endIcon={<ArrowBackIosIcon/>}
                                    >
                                        {t('credentials.signUp.backButton')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={!isStep2Valid()}
                                        sx={{
                                            maxWidth: 200,
                                            width: '48%'
                                        }}
                                        endIcon={(isAddNewVolunteerLoading || isAddNewOrganizerLoading) ?
                                            <CircularProgress size={24} style={{color: 'white'}}/> : <SendIcon/>}
                                    >
                                        {t('credentials.signUp.signUpButton')}
                                    </Button>
                                </>
                            )}

                            {/*{activeStep === 2 && (*/}
                            {/*    <Button*/}
                            {/*        variant="contained"*/}
                            {/*        type="button"*/}
                            {/*        onClick={handleCheckCode}*/}
                            {/*        disabled={code === ''}*/}
                            {/*        sx={{*/}
                            {/*            maxWidth: 300,*/}
                            {/*            width: '100%'*/}
                            {/*        }}*/}
                            {/*        endIcon={isCheckCodeLoading ?*/}
                            {/*            <CircularProgress size={24} style={{color: 'white'}}/> : <SendIcon/>}*/}
                            {/*    >*/}
                            {/*        {t('credentials.signUp.confirmButton')}*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                        </Box>
                    </Stack>
                </form>
            </Stack>
        </Box>
    );
}

export const LoginModal = ({handleClose, requireNavigation}) => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('')
    const [showConfirmArea, setShowConfirmArea] = useState(false)
    const [codeCheckError, setCodeCheckError] = useState('')
    const [code, setCode] = useState('')
    const [id, setId] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [login, {isLoading: isLoginLoading}] = useLoginMutation()

    const [addNewCode] = useAddNewCodeMutation()

    const [checkCode] = useCheckCodeValidityMutation()

    const [sendCode] = useSendRegistrationConfirmationEmailMutation()

    const [validateUser] = useValidateUserMutation()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        if (!validateEmail(newEmail)) {
            setEmailError(t('credentials.login.invalidEmail'));
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const isFormValid = validateEmail(email) && password;

    const jumpAndClose = () => {
        if (handleClose) {
            handleClose()
        }
        navigate('/reset-password')
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const loginData = await login({emailAddress: email, password: password})
            if (loginData.data?.status === 200) {
                dispatch(setCredentials({
                    accessToken: loginData.data.response.accessToken,
                    userId: loginData.data.response.userId,
                    role: loginData.data.response.role
                }))
                if (requireNavigation) {
                    navigate('/')
                }
                handleClose()
            } else if (loginData.error?.status === 404) {
                setLoginError(t('credentials.login.loginNoUserError'))
            } else if (loginData.error?.status === 401 && loginData.error?.data.message === "Unauthorized") {
                setLoginError(t('credentials.login.loginWrongCredential'))
            } 
            // else if (loginData.error?.status === 401 && loginData.error?.data.message === "Unconfirmed") {
            //     setLoginError(t('credentials.login.loginUnconfirmed'))
            //     setId(loginData.error?.data.userId)
            //     setShowConfirmArea(true)
            // }
        } catch (error) {
            console.log(error)
        }
    }

    // const resendCode = async () => {
    //     const codeResponse = await addNewCode({userId: id, usage: "REGISTRATION"})
    //     const sendCodeResponse = await sendCode({
    //         userId: id,
    //         usage: "REGISTRATION",
    //         username: username,
    //         user_email_address: email
    //     })
    // }

    // const handleCheckCode = async (event) => {
    //     const result = await checkCode({userId: id, usage: "REGISTRATION", inputValue: code})
    //     if (result.data?.status === 200) {
    //         await validateUser({userId: id, updateData: {isValidUser: true}});
    //         setShowConfirmArea(false)
    //         setLoginError("")
    //     } else {
    //         setCodeCheckError(t('credentials.signUp.codeCheckError'))
    //     }
    // }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 500,
                maxWidth: 900,
                padding: 2,
                margin: '10px auto',
            }}
        >
            <form style={{width: '70%'}}>
                <Stack spacing={1} sx={{width: '100%'}}>
                    <TextField
                        id="outlined-basic"
                        label={t('credentials.login.email')}
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        error={!!emailError}
                        helperText={emailError}
                        required
                        fullWidth
                    />

                    <FormControl variant="outlined" required>
                        <InputLabel htmlFor="outlined-adornment-password">
                            {t('credentials.login.password')}
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            required
                            label={t('credentials.login.password')}
                            fullWidth
                        />
                    </FormControl>

                    <Button
                        variant="contained"
                        disabled={!isFormValid || showConfirmArea}
                        onClick={handleLogin}
                        endIcon={isLoginLoading ?
                            <CircularProgress size={24} style={{color: 'white'}}/> : <LoginIcon/>}
                    >
                        {t('credentials.login.login')}
                    </Button>

                    {loginError && <Alert severity="error">{loginError}</Alert>}

                    {/*{showConfirmArea && (*/}
                    {/*    <>*/}
                    {/*        <Step3*/}
                    {/*            code={code}*/}
                    {/*            setCode={setCode}*/}
                    {/*            codeCheckError={codeCheckError}*/}
                    {/*            resendCode={resendCode}*/}
                    {/*        />*/}
                    {/*        <Button*/}
                    {/*            variant="contained"*/}
                    {/*            type="button"*/}
                    {/*            onClick={handleCheckCode}*/}
                    {/*            disabled={code === ''}*/}
                    {/*            style={{width: '100%'}}>*/}
                    {/*            {t('credentials.signUp.confirmButton')}*/}
                    {/*        </Button>*/}
                    {/*    </>*/}
                    {/*)}*/}
                </Stack>
                <Divider style={{marginTop: "10px"}}/>
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" component="span">
                        {t('credentials.login.forget')}{' '}
                        <Link
                            variant="body2"
                            onClick={jumpAndClose}
                            sx={{fontSize: 'inherit', textDecoration: 'underline', cursor: 'pointer'}}
                        >
                            {t('credentials.login.reset')}
                        </Link>
                    </Typography>
                </Box>
            </form>
        </Box>
    )
}