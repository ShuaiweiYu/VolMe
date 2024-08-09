import React, {useState, useEffect} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Grid,
    Typography,
    styled,
    Box, Chip, TextField, Alert
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useGetUserByUserIdQuery} from '../../redux/users/usersApiSlice'
import {useSetApplicationStatusMutation} from "../../redux/applications/applicationApiSlice"
import ErrorComponent from "../../components/ErrorComponent";
import {useTranslation} from 'react-i18next';
import PdfModal from "../../util/PdfModal";
import PersonIcon from "@mui/icons-material/Person";
import RestoreIcon from '@mui/icons-material/Restore';
import {getFileUrl} from "../../util/fileUploaderWrapper";
import {LoadingButton} from "@mui/lab";
import CircularProgress from "@mui/material/CircularProgress";
import Brightness5Icon from '@mui/icons-material/Brightness5';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ElderlyIcon from '@mui/icons-material/Elderly';
import FaceIcon from '@mui/icons-material/Face';
import TranslateIcon from '@mui/icons-material/Translate';
import {
    useSendApplicationAcceptedEmailMutation,
    useSendApplicationDeclinedEmailMutation,
    useSendApplicationWithdrawEmailMutation
} from "../../redux/emails/emailsApiSlice"
import {useSetApplicationPresentedMutation} from "../../redux/applications/applicationApiSlice"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import dayjs from "dayjs";
import {useLazyGetDocumentByIdQuery} from "../../redux/documents/documentApiSlice"
import Stack from "@mui/material/Stack";

const CustomAccordionSummary = styled((props) => <AccordionSummary {...props} />)(({theme, ownerState}) => ({
    backgroundColor: ownerState.expanded ? theme.palette.action.selected : 'inherit',
}));

const ApplicationItem = ({application, eventObj, peopleAmountSatisfied, isStarted}) => {
    const [expanded, setExpanded] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [pdfs, setPdfs] = useState([]);

    const {t} = useTranslation();

    const [updateStatus, {isLoading: isSetApplicationStatusLoading}] = useSetApplicationStatusMutation()

    const [sendAcceptedCode] = useSendApplicationAcceptedEmailMutation()
    const [sendDeclinedCode] = useSendApplicationDeclinedEmailMutation()
    const [sendWithdrawCode] = useSendApplicationWithdrawEmailMutation()

    const {
        data: userResponse,
        isLoading: isGetUserLoading,
        isSuccess: isGetUserSuccess,
        isError: isGetUserError,
        error: getUserError
    } = useGetUserByUserIdQuery(application.volunteerID);

    const [setPresented, {isLoading: isSetPresentedLoading}] = useSetApplicationPresentedMutation()

    const [getDocu, {data: docuData, isFetching: isDocuFetching}] = useLazyGetDocumentByIdQuery()

    useEffect(() => {
        const fetchPdfs = async () => {
            const newPdfs = [];
            for (const file of application.files) {
                const docuData = await getDocu(file);
                newPdfs.push(docuData.data.response);
            }
            setPdfs(newPdfs);
        };

        fetchPdfs();
    }, [application.files]);

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleClickExpansion = () => () => {
        setExpanded(!expanded);
    };

    const handleAcceptClick = (event) => {
        event.stopPropagation();
        setClickedButton("accept");
        updateStatus({applicationID: application._id, status: {status: "ACCEPTED"}})
        sendAcceptedCode({
            username: userResponse.response.username,
            user_email_address: userResponse.response.emailAddress,
            eventName: eventObj.title
        })
    };

    const handleDeclineClick = (event) => {
        event.stopPropagation();
        setClickedButton("decline");
        updateStatus({applicationID: application._id, status: {status: "DECLINED"}})
        sendDeclinedCode({
            username: userResponse.response.username,
            user_email_address: userResponse.response.emailAddress,
            eventName: eventObj.title
        })
    };

    const handleSetPresented = (event) => {
        event.stopPropagation();
        setPresented({applicationID: application._id, isPresented: {isPresented: true}})
    }

    const handleWithdraw = (event) => {
        event.stopPropagation();
        updateStatus({applicationID: application._id, status: {status: "PENDING"}})
        sendWithdrawCode({
            username: userResponse.response.username,
            user_email_address: userResponse.response.emailAddress,
            eventName: eventObj.title
        })
    };

    useEffect(() => {
        if (isGetUserSuccess) {
            generateHighlights();
        }
    }, [isGetUserSuccess]);

    const generateHighlights = () => {
        const highlightsArr = []
        if (userResponse.response.participationCount >= 5) {
            highlightsArr.push({label: "Active Volunteer", icon: <Brightness5Icon/>})
        } else if (userResponse.response.participationCount === 0) {
            highlightsArr.push({label: "Freshman", icon: <ChildCareIcon/>})
        }

        if (calculateAge(userResponse.response.birthday) >= 60) {
            highlightsArr.push({label: "Elderly", icon: <ElderlyIcon/>})
        } else if (calculateAge(userResponse.response.birthday) <= 18) {
            highlightsArr.push({label: "Teenager", icon: <FaceIcon/>})
        }

        if (userResponse.response.languages >= 3) {
            highlightsArr.push({label: "Multilingual", icon: <TranslateIcon/>})
        }
        setHighlights(highlightsArr)
    }

    const UserDetails = ({usr}) => {
        return (
            <>
                {usr._id && <Box sx={{p: 3, backgroundColor: 'transparent', borderRadius: 2}}>
                    <Grid container direction="column" alignItems="center" spacing={2}>
                        <Grid container direction="row" alignItems="center" spacing={2}>
                            <Grid item xs/>
                            <Grid item>
                                <Avatar
                                    src={getFileUrl(usr.profilePicturePath, "icon", "display")}
                                    sx={{width: 100, height: 100}}
                                >
                                    <PersonIcon
                                        sx={{width: 80, height: 80}}
                                    />
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="div">
                                    {usr.username}
                                </Typography>
                            </Grid>
                            <Grid item xs/>
                        </Grid>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label={t("applicationItem.firstname")}
                                    value={usr.firstname}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label={t("applicationItem.lastname")}
                                    value={usr.lastname}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label={t("applicationItem.age")}
                                    value={calculateAge(usr.birthday)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label={t("applicationItem.count")}
                                    value={usr.participationCount}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="gender"
                                    label="Gender"
                                    variant="outlined"
                                    fullWidth
                                    value={usr.gender || 'Not Specified'}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box>
                                        <DatePicker
                                            label="Birthday"
                                            value={dayjs(usr.birthday)}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" fullWidth disabled/>
                                            )}
                                            inputFormat="YYYY-MM-DD"
                                            sx={{width: '100%'}}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t("applicationItem.email")}
                                    value={usr.emailAddress}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={"Phone number"}
                                    value={usr.phoneNumber}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid item container spacing={2}>
                            <Grid item xs={12} sm={2}>
                                <Typography>{t("applicationItem.skills")}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Box sx={{display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap'}}>
                                    {usr.skills.length === 0 &&
                                        <Typography>
                                            No skills specified by the user
                                        </Typography>}
                                    {usr.skills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            // icon={highlight.icon}
                                            label={skill}
                                            sx={{mx: 0.5}}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} sm={2}>
                                <Typography>{t("applicationItem.languages")}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Box sx={{display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap'}}>
                                    {usr.languages.length === 0 &&
                                        <Typography>
                                            No languages specified by the user
                                        </Typography>}
                                    {usr.languages.map((language, index) => (
                                        <Chip
                                            key={index}
                                            label={language}
                                            sx={{mx: 0.5}}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2}>
                            {isDocuFetching && <CircularProgress/>}
                            {pdfs.length > 0 && pdfs.map((file, index) => {
                                return (
                                    <Grid item xs={12} sm={4} key={index}>
                                        <PdfModal
                                            title={file.requiredFileType}
                                            file={getFileUrl(file.path, "pdf", "original")}
                                            renderMessage={"volMe application only"}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Box>}
            </>
        );
    };

    return (
        <>
            {isGetUserError && <ErrorComponent message={getUserError.data.message} noHeight={true}/>}
            {(isGetUserSuccess || isGetUserLoading) &&
                <Box>
                    <Accordion expanded={expanded} onChange={handleClickExpansion()}>
                        <CustomAccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            ownerState={{expanded: expanded}}
                        >
                            {isGetUserSuccess ? (
                                <>
                                    {isStarted ?
                                        <>
                                            <Grid container alignItems="center" spacing={2} wrap="nowrap">
                                                {!expanded &&
                                                    <Grid item>
                                                        {userResponse.response.profilePicturePath ? (
                                                            <Avatar
                                                                src={getFileUrl(userResponse.response.profilePicturePath, "icon", "preview")}
                                                                sx={{width: 30, height: 30}}
                                                            >
                                                                <PersonIcon/>
                                                            </Avatar>
                                                        ) : (
                                                            <Avatar
                                                                sx={{width: 30, height: 30}}
                                                            >
                                                                <PersonIcon/>
                                                            </Avatar>
                                                        )}
                                                    </Grid>}
                                                {!expanded &&
                                                    <>
                                                        <Grid item>
                                                            <Typography>{t("applicationItem.user")} {userResponse.response.username}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            {application.isPresented && <Alert>checked in</Alert>}
                                                        </Grid>
                                                    </>
                                                }
                                                {
                                                    expanded && (
                                                        <> {application.status === "ACCEPTED" && (
                                                            <>
                                                                <Grid item>
                                                                    {application.isPresented && <Alert>checked in</Alert>}
                                                                </Grid>
                                                                <Grid item xs/>
                                                                <Grid item>
                                                                    <LoadingButton
                                                                        variant="contained"
                                                                        color="error"
                                                                        loading={isSetPresentedLoading}
                                                                        disabled={application.isPresented}
                                                                        startIcon={<CheckBoxIcon/>}
                                                                        onClick={handleSetPresented}
                                                                    >
                                                                        {t("applicationItem.checkin")}
                                                                    </LoadingButton>
                                                                </Grid>

                                                                <Grid item sx={{mx: 0.1}}/>
                                                            </>)}

                                                            <Grid item sx={{mx: 0.1}}/>
                                                        </>
                                                    )
                                                }
                                            </Grid>
                                        </> :
                                        <>
                                            <Grid container alignItems="center" spacing={2} wrap="nowrap">
                                                {!expanded &&
                                                    <Grid item>
                                                        {userResponse.response.profilePicturePath ? (
                                                            <Avatar
                                                                src={getFileUrl(userResponse.response.profilePicturePath, "icon", "preview")}
                                                                sx={{width: 30, height: 30}}
                                                            >
                                                                <PersonIcon/>
                                                            </Avatar>
                                                        ) : (
                                                            <Avatar
                                                                sx={{width: 30, height: 30}}
                                                            >
                                                                <PersonIcon/>
                                                            </Avatar>
                                                        )}
                                                    </Grid>}
                                                {!expanded &&
                                                    <Grid item>
                                                        <Typography>{t("applicationItem.user")} {userResponse.response.username}</Typography>
                                                    </Grid>}
                                                <Grid item sx={{display: {xs: 'none', md: 'flex',}}}>
                                                    <Typography>{t("applicationItem.highlights")}</Typography>
                                                </Grid>
                                                <Grid item xs>
                                                    <Box
                                                        sx={{display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap'}}>
                                                        {highlights.length > 0 && highlights.map((highlight, index) => (
                                                            <Chip
                                                                key={index}
                                                                icon={highlight.icon}
                                                                label={highlight.label}
                                                                size="small"
                                                                sx={{mx: 0.5}}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Grid>
                                                {
                                                    expanded && (
                                                        <> {application.status === "PENDING" ? (
                                                            <>
                                                                <Grid item>
                                                                    <LoadingButton
                                                                        variant="contained"
                                                                        color="success"
                                                                        loading={isSetApplicationStatusLoading && clickedButton === "accept"}
                                                                        disabled={(isSetApplicationStatusLoading && clickedButton === "decline") || peopleAmountSatisfied}
                                                                        startIcon={<CheckCircleIcon/>}
                                                                        onClick={handleAcceptClick}
                                                                    >
                                                                        {t("applicationItem.accept")}
                                                                    </LoadingButton>
                                                                </Grid>
                                                                <Grid item>
                                                                    <LoadingButton
                                                                        variant="contained"
                                                                        color="error"
                                                                        loading={isSetApplicationStatusLoading && clickedButton === "decline"}
                                                                        disabled={isSetApplicationStatusLoading && clickedButton === "accept"}
                                                                        startIcon={<CancelIcon/>}
                                                                        onClick={handleDeclineClick}
                                                                    >
                                                                        {t("applicationItem.decline")}
                                                                    </LoadingButton>
                                                                </Grid>
                                                            </>) : (
                                                            <Grid item>
                                                                <LoadingButton
                                                                    variant="contained"
                                                                    color="warning"
                                                                    loading={isSetApplicationStatusLoading}
                                                                    startIcon={<RestoreIcon/>}
                                                                    onClick={handleWithdraw}
                                                                >
                                                                    {t("applicationItem.withdraw")}
                                                                </LoadingButton>
                                                            </Grid>
                                                        )}

                                                            <Grid item sx={{mx: 0.1}}/>
                                                        </>
                                                    )
                                                }
                                            </Grid>
                                        </>}

                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress/>
                                </Box>
                            )}
                        </CustomAccordionSummary>
                        {isGetUserSuccess && (
                            <AccordionDetails>
                                <UserDetails usr={userResponse.response}/>
                            </AccordionDetails>
                        )}
                    </Accordion>
                </Box>
            }
        </>
    );
};

export default ApplicationItem;
