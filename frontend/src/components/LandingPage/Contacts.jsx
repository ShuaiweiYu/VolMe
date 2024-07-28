import React, {useState} from 'react'
import Box from '@mui/material/Box';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import {Button, Stack, styled, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import SvgIcon from '@mui/material/SvgIcon';
import {useSendContactEmailMutation} from "../../redux/emails/emailsApiSlice"
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const StyledTextField = styled(TextField)(({value}) => ({
    borderColor: 'divider',
    //borderRadius: '15px',
    '& .MuiInputBase-root': {
        backgroundColor: !value ? "#F7F7F6" : "white",
    },
}));

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const Contacts = () => {
    const {t} = useTranslation();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contentError, setContentError] = useState('');
    const [sendContact] = useSendContactEmailMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        sendContact({email_address: email, name: name, info: message})
        setName("")
        setEmail("")
        setMessage("")
        toast.success("Contact E-Mail sent!")
    };

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        if (!validateEmail(newEmail)) {
            setEmailError("Invalid E-Mail address");
        } else {
            setEmailError('');
        }
    };

    const handleNameChange = (event) => {
        const name = event.target.value;
        setName(name);

        if (name.length > 20) {
            setNameError("name too long!")
        }
    };

    const handleContentChange = (event) => {
        const content = event.target.value;
        setMessage(content)

        if (content.length > 2000) {
            setContentError("content too long!")
        }
    };

    return <Box id="contacts">
        <Box sx={{height: '70vh', width: '100%'}}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2655.935995320938!2d11.668421976293876!3d48.26560624223946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e72ecea34e265%3A0x1a8c02db0f117cfb!2sTechnical%20University%20of%20Munich%20Garching!5e0!3m2!1sen!2sde!4v1718799218766!5m2!1sen!2sde"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </Box>
        <Box
            sx={{
                backgroundColor: "#FCFCF6",
                width: '100%',
                '@media screen and (min-width: 799px)': {
                    '--offset-height': '-100px',
                    display: 'grid',
                    gridTemplateColumns: '3fr 1.5fr',
                    width: '80vw',
                    height: '475px',
                    margin: '0 auto',
                    top: 'var(--offset-height)',
                    left: '50%',
                    marginLeft: '-40vw',
                    marginBottom: 'var(--offset-height)',
                    position: 'relative',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 5px 1px rgba(0, 0, 0, 0.15)',
                }
            }}
        >
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    //justifyContent: 'center',
                    //alignItems: 'center',
                    padding: '37px',
                    maxWidth: '100%',
                }}
            >
                <Typography
                    color=""
                    sx={{
                        textTransform: 'uppercase',
                        gridArea: 'header',
                        textAlign: 'left',
                        fontFamily: 'PT Sans',
                        fontSize: 25,
                        fontWeight: 500,
                    }}
                >
                    {t("contacts.send")}
                </Typography>

                <br/>

                <Stack container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2}
                               sx={{
                                   //display: 'flex',
                                   //flexDirection: 'column',
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   maxWidth: '100%',
                                   //padding: '20px'
                               }}
                        >

                            <StyledTextField
                                required
                                fullWidth
                                label="Your Name"
                                sx={{borderRadius: '30px'}}
                                value={name}
                                onChange={handleNameChange}
                                error={!!nameError}
                                helperText={nameError}
                            />

                            <StyledTextField
                                required
                                fullWidth
                                label="Your Email"
                                autoComplete="email"
                                sx={{borderRadius: '30px'}}
                                onChange={handleEmailChange}
                                value={email}
                                error={!!emailError}
                                helperText={emailError}
                            />

                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <StyledTextField
                            required
                            fullWidth
                            label="Your Message"
                            multiline
                            rows={6}
                            sx={{borderRadius: '30px'}}
                            value={message}
                            onChange={handleContentChange}
                            error={!!contentError}
                            helperText={contentError}
                        />
                    </Grid>

                    <br/>

                    <Grid item xs={12} sm={6}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button onClick={handleSubmit} sx={{color: "#5CBC63", borderRadius: '999px'}} variant="text"
                                    disabled={(!!nameError || !!emailError || !!contentError) || name === "" || email === "" || message === ""}>
                                <SendRoundedIcon sx={{fontSize: 50}}/>
                            </Button>
                        </Box>
                    </Grid>

                </Stack>
            </Box>

            <Box
                sx={{
                    textAlign: 'left',
                    padding: '20px',
                    backgroundColor: "#5CBC63",
                    color: "white",

                }}
            >
                <Box
                    sx={{
                        textAlign: 'left',
                        padding: '20px',
                        backgroundColor: "#5CBC63",
                        color: "primary",
                    }}
                >
                    <Typography
                        sx={{
                            textTransform: 'uppercase',
                            fontFamily: 'PT Sans',
                            fontSize: 25,
                            fontWeight: 500,
                            margin: 0,
                        }}
                    >
                        {t("contacts.info")}
                    </Typography>
                </Box>

                <Stack container spacing={2} sx={{padding: '20px'}}>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2}>
                            <LocationOnRoundedIcon/>
                            <Typography>
                                Boltzmannstraße 15 85748<br/>
                                Garching bei München<br/>
                                Bavaria
                            </Typography>
                        </Stack>
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2}>
                            <LocalPhoneRoundedIcon/>
                            <Typography>
                                +49 123 456 789 00
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2}>
                            <EmailRoundedIcon/>
                            <Typography>
                                support@volme.com
                            </Typography>
                        </Stack>
                    </Grid>


                    <Box mt={3} position="absolute" bottom="50px" sx={{alignItems: 'center'}}>
                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={2} sx={{display: {xs: 'none', lg: 'block'}}}>
                                <Button href="https://www.tiktok.com/" variant="text">
                                    <SvgIcon>
                                        {/* tiktok logo */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={40}
                                            height={40}
                                            viewBox="0 0 40 40"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="white"
                                                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74a2.89 2.89 0 0 1 2.31-4.64a2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z">

                                            </path>
                                        </svg>
                                        )
                                    </SvgIcon>
                                </Button>

                                <Button href="https://www.instagram.com/" variant="text">
                                    <SvgIcon>
                                        {/* instagram logo */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={40}
                                            height={40}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="white"
                                                d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216a4.61 4.61 0 0 0-2.633-2.633a6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42a4.607 4.607 0 0 0-2.633 2.633a6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632a6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419a4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187c.043-.962.056-1.267.056-3.71c-.002-2.442-.002-2.752-.058-3.709m-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246m4.807-8.339a1.077 1.077 0 0 1-1.078-1.078a1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078">

                                            </path>
                                            <circle cx={11.994} cy={11.979} r={3.003} fill="white"></circle>
                                        </svg>
                                    </SvgIcon>
                                </Button>

                                <Button href="https://www.x.com/" variant="text">
                                    <SvgIcon>
                                        {/* x logo */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            shapeRendering="geometricPrecision"
                                            textRendering="geometricPrecision"
                                            imageRendering="optimizeQuality"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            viewBox="0 0 512 462.799"
                                        >
                                            <path
                                                fillRule="nonzero"
                                                fill="white"
                                                d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                                            />
                                        </svg>
                                    </SvgIcon>
                                </Button>

                                <Button href="https://www.youtube.com/" variant="text">
                                    <SvgIcon>
                                        {/* youtube logo */}

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={40}
                                            height={40}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="white"
                                                d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765c1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831M9.996 15.005l.005-6l5.207 3.005z">

                                            </path>
                                        </svg>
                                    </SvgIcon>
                                </Button>
                            </Stack>
                        </Grid>
                    </Box>

                </Stack>
            </Box>
        </Box>
    </Box>
}

export default Contacts