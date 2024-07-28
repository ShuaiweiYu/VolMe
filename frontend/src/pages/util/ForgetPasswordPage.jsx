import React, {useState} from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment, FormHelperText
} from '@mui/material';
import {useTranslation} from "react-i18next";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {Divider} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import {useLazyGetUserByEmailAddressQuery, useUpdateUserCredentialMutation} from "../../redux/users/usersApiSlice";
import {
    useAddNewCodeMutation,
    useCheckCodeValidityMutation
} from '../../redux/codes/codesApiSlice'
import {useSendPasswordResetEmailMutation} from "../../redux/emails/emailsApiSlice"
import CircularProgress from "@mui/material/CircularProgress";

const ForgotPassword = () => {
    const {t} = useTranslation();

    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPart2, setShowPart2] = useState(false);
    const [showPart3, setShowPart3] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [userId, setUserId] = useState("");
    const [secret, setSecret] = useState("");

    const [getUserByEmailAddress] = useLazyGetUserByEmailAddressQuery()

    const [addNewCode, {
        isLoading: isAddNewCodeLoading,
        isSuccess: isAddNewCodeSuccess,
        isError: isAddNewCodeError,
    }] = useAddNewCodeMutation();

    const [checkCode, {
        isLoading: isCheckCodeLoading,
        isSuccess: isCheckCodeSuccess,
        isError: isCheckCodeError
    }] = useCheckCodeValidityMutation()

    const [sendEmail, {
        isError: isSendCodeError
    }] = useSendPasswordResetEmailMutation()

    const [updateUserCredential] = useUpdateUserCredentialMutation()

    const steps = [t('resetPassword.stepsList1'), t('resetPassword.stepsList2'), t('resetPassword.stepsList3')]

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        if (!validateEmail(newEmail)) {
            setEmailError(t('credentials.login.invalidEmail'));
        } else {
            setEmailError('');
        }
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        if (confirmPassword && newPassword !== confirmPassword) {
            setPasswordError(t('credentials.signUp.passwordNotMatch'));
        } else if (newPassword.length > 50) {
            setPasswordError(t('credentials.signUp.passwordTooLong'));
        } else {
            setPasswordError('');
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleConfirmPasswordChange = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);

        if (password && newConfirmPassword !== password) {
            setPasswordError(t('credentials.signUp.passwordNotMatch'));
        } else {
            setPasswordError('');
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const sendCode = async () => {
        try {
            const userData = await getUserByEmailAddress(email);
            if (userData.isError) {
                if (userData.error.status === 404) {
                    setEmailError(t('resetPassword.userNotFound'))
                } else {
                    setEmailError(t('resetPassword.generalErrorInfo'))
                }

            } else {
                setUserId(userData.data.response._id)
                const result = await addNewCode({userId: userData.data.response._id, usage: "PASSWORDRESET"})
                await sendEmail({userId: userData.data.response._id, usage: "PASSWORDRESET", username: userData.data.response.username, user_email_address: email})
                if (userData.data.status === 200 && result.data.status === 201) {
                    handleNext();
                    setShowPart2(true);
                } else {
                    alert(t('resetPassword.generalErrorInfo'))
                }
            }
        } catch (error) {
            console.error('Error sending code:', error);
        }
    }

    const verifyCode = async () => {
        try {
            const result = await checkCode({userId: userId, usage: "PASSWORDRESET", inputValue: code})
            if (result.data?.status === 200) {
                setSecret(result.data.secret)
                handleNext();
                setShowPart3(true);
            } else if (result.data?.status === 400) {
                setCodeError(t('resetPassword.codeError'))
            } else {
                setCodeError(t('resetPassword.generalErrorInfo'))
            }
        } catch (error) {
            console.error('Error verifying code:', error);
        }
    }

    const changePassword = async () => {
        await updateUserCredential({userId: userId, updateData: {password: password, secret: secret}})
        handleNext();
        setResetSuccess(true)
    }

    return (
        <Container maxWidth="sm">
            {!resetSuccess && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <Typography variant="h1" component="h1" gutterBottom>
                        {t('resetPassword.title')}
                    </Typography>

                    <Divider style={{margin: "10px 0"}}/>

                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Typography style={{ marginTop: '20px' }}>
                        {t('resetPassword.emailInfo')}
                    </Typography>

                    <TextField
                        id="outlined-email"
                        label={t('resetPassword.email')}
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={handleEmailChange}
                        error={!!emailError}
                        helperText={emailError}
                        required
                        margin="normal"
                        autoComplete="email"
                        InputProps={{
                            readOnly: showPart2
                        }}
                    />

                    <Button
                        type="button"
                        onClick={sendCode}
                        disabled={emailError !== '' || email === '' || isAddNewCodeLoading || isAddNewCodeSuccess}
                        variant="contained"
                        fullWidth
                        endIcon={isAddNewCodeLoading ? <CircularProgress size={24}/> : <SendIcon/>}
                        style={{width: '50%'}}
                    >
                        {t('resetPassword.sendCodeButton')}
                    </Button>

                    {showPart2 && (
                        <>
                            <Typography style={{ marginTop: '20px' }}>
                                {t('resetPassword.codeInfo')}
                            </Typography>

                            <TextField
                                id="outlined-email"
                                label={t('resetPassword.code')}
                                variant="outlined"
                                fullWidth
                                value={code}
                                onChange={event => setCode(event.target.value)}
                                error={!!codeError}
                                helperText={codeError}
                                required
                                margin="normal"
                                InputProps={{
                                    readOnly: showPart3
                                }}
                            />

                            <Button
                                type="button"
                                onClick={verifyCode}
                                disabled={codeError !== '' || code === '' || isCheckCodeLoading || isCheckCodeSuccess}
                                variant="contained"
                                fullWidth
                                endIcon={isAddNewCodeLoading ? <CircularProgress size={24}/> : <SendIcon/>}
                                style={{width: '50%'}}
                            >
                                {t('resetPassword.confirmButton')}
                            </Button>
                        </>
                    )}

                    {showPart3 && (
                        <>
                            <Typography style={{ marginTop: '20px' }}>
                                {t('resetPassword.resetInfo')}
                            </Typography>

                            <FormControl variant="outlined" fullWidth margin="normal" required>
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
                                    inputProps={{
                                        readOnly: resetSuccess
                                    }}
                                />
                            </FormControl>

                            <FormControl variant="outlined" fullWidth margin="normal" error={!!passwordError} required>
                                <InputLabel
                                    htmlFor="outlined-confirm-password">{t('credentials.signUp.step1ConfirmPassword')}
                                </InputLabel>
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
                                    inputProps={{
                                        readOnly: resetSuccess
                                    }}
                                />
                                {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
                            </FormControl>

                            <Button
                                type="button"
                                onClick={changePassword}
                                disabled={passwordError !== '' || password === '' || confirmPassword === ''}
                                variant="contained"
                                fullWidth
                                endIcon={<DoneIcon/>}
                                style={{width: '50%'}}
                            >
                                {t('resetPassword.confirmPassword')}
                            </Button>
                        </>
                    )}

                    {isAddNewCodeError && isSendCodeError && isCheckCodeError (
                        <Typography color="error">
                            {t('resetPassword.generalErrorInfo')}
                        </Typography>
                    )}


                </Box>
            )}
            {resetSuccess && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('resetPassword.success')}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default ForgotPassword;
