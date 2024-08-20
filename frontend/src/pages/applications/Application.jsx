import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import FileUploadBox from '../../components/Applications/FileUploadBox.jsx'
import {
    useCreateApplicationMutation, useGetApplicationByIDQuery, useUpdateApplicationMutation,
} from "../../redux/applications/applicationApiSlice";
import {
    Box,
    Stack,
    Button,
    Avatar,
    alpha,
    Typography,
    Container,
    IconButton,
    ListItemText,
    List,
    ListItem,
    Divider
} from '@mui/material'
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {useGetEventByIdQuery} from "../../redux/events/eventApiSlice";
import {getFileUrl, upload} from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import {Link, useParams} from "react-router-dom";
import {useCreateDocumentMutation} from "../../redux/documents/documentApiSlice"
import {Link as RouterLink} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import ImageWindow from "../../components/EventPage/ImageWindow";
import ChatPopupButton from "../../components/Chat/ChatPopupButton";
import {useSendApplicationNotificationEmailMutation} from "../../redux/emails/emailsApiSlice"
import dayjs from "dayjs";
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from "../../theme";
import {styled} from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useNavigate} from 'react-router-dom';

const StyledButton = styled(Button)(({ theme, variant }) => ({
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

const Application = () => {
    const {eventID, applicationID} = useParams();

    const [files, setFiles] = useState([])
    let fileIDs = []
    const navigate = useNavigate();


    const [createApplication] = useCreateApplicationMutation();
    const [updateApplication] = useUpdateApplicationMutation();


    const [presentedFiles, setPresentedFiles] = useState([])// save the uploaded files at first.

    const {data: event, isLoading, isSuccess, error} = useGetEventByIdQuery(eventID);

    const volunteerID = useSelector(selectCurrentUserId)
    const volunteer = useGetUserByUserIdQuery(volunteerID)
    const organizer = useGetUserByUserIdQuery(
        event?.response.organiser,
        {
            skip: !event?.response.organiser,
        }
    );
    const userID = useSelector(selectCurrentUserId)
    const [createDocument] = useCreateDocumentMutation();
    const [sendNotification] = useSendApplicationNotificationEmailMutation()
    const {
        data: draftData,
        isLoading: isLoadingDraft
    } = useGetApplicationByIDQuery(applicationID, {skip: !applicationID});



    useEffect(() => {
        if (applicationID && draftData) {
            // setPresentedFiles(draftData.response.files); // Adjust based on your data structure
            setFiles(draftData.response.files)

        }
    }, [draftData, applicationID]);

    const handleFilesChange = (newFiles) => {
        setPresentedFiles(newFiles);
    };

    const handleFileDelete = (id) => {
        setPresentedFiles(prevPresentedFiles => {
                const temp = prevPresentedFiles.filter(file => file.id !== id)
                return temp
            }
        );

    };

    const handleFileDeletePresented    = (id) => {
        setPresentedFiles(prevPresentedFiles => {
                const temp = prevPresentedFiles.filter(file => file.id !== id)
                return temp
            }
        );
        setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    };

    const handleUpload = async () => {
        const newUploadURLs = [];
        for (const file of presentedFiles) {

            if (file.type === "pdf") {// already uploaded
            } else if (file.type === "application/pdf") {
                try {
                    const url = await upload(file.file, "pdf", volunteerID);
                    newUploadURLs.push(url);

                    // Create document model
                    const result = await createDocument({
                        eventId: eventID,
                        userId: volunteerID,
                        path: url,
                        name: file.name,
                        type: 'pdf',
                        requiredFileType: file.requiredFileType
                    }).unwrap();

                  await  setFiles(prevState => [...prevState, result?.response]);
                    fileIDs.push(result.response._id)
                    if (result.error) {
                        toast.error(result.error);
                    } else {
                        toast.success(`${file.name} is uploaded.`);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Uploading file failed, try again.");
                }
            } else {
                try {
                    const url = await upload(file.file, "image", volunteerID);
                    newUploadURLs.push(url);
                } catch (error) {
                    console.error(error);
                    toast.error("Uploading image failed, try again.");
                }
            }
        }
    }

    const handleApply = async (isDraft = false) => {
        //e.preventDefault();
        await handleUpload()

        try {
            if (applicationID) {
                const result = await updateApplication({
                    eventID: eventID,
                    volunteerID: volunteerID,
                    files: fileIDs,//Document ID list
                    isDraft: isDraft
                }).unwrap();

                sendNotification({username: organizer.data.response.username, user_email_address: organizer.data.response.emailAddress, eventName: event.data?.response.title})


                if (result.error) {
                    toast.error(result.error);
                } else {
                    const action = isDraft ? 'draft saved' : 'application created';
                    toast.success(`Your ${action} for this event.`);
                    navigate('/my-events');
                }
            } else {
                const result = await createApplication({
                    eventID: eventID,
                    volunteerID: volunteerID,
                    files: fileIDs,//Document ID list
                    isDraft: isDraft
                }).unwrap();

                sendNotification({username: organizer.data.response.username, user_email_address: organizer.data.response.emailAddress, eventName: event.data?.response.title})

                if (result.error) {
                    toast.error(result.error);
                } else {
                    const action = isDraft ? 'draft saved' : 'application created';
                    toast.success(`Your ${action} for this event.`);
                    navigate('/my-events');
                }
            }


        } catch (error) {
            toast.error(error.data.message);
        }
    };


    const handleAvatarError = (event) => {
        event.target.src = '/path/to/default/image';
    };


    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Container id="event-management" sx={{width: '80%', margin: '30px auto', fontFamily: 'Arial, sans-serif'}}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={4}>
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        //boxShadow: 5,
                        backdropFilter: 'blur(24px)',
                        borderRadius: '15px',
                        border: '1px solid',
                        borderColor: 'divider',
                        padding: '10px',
                    }}
                >

                    <Typography variant="h2" textAlign="center">{event?.response.title}</Typography>
                    <Stack sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left'}}>
                        {event && (
                            <>
                                <Box sx={{textAlign: 'center', marginBottom: '20px'}}>
                                    <ImageWindow uploadURL={event?.response.uploadURL}/>
                                </Box>

                                <Typography variant="h3">Date</Typography>
                                    <Typography>Start Date: {dayjs(event?.response.startDate).format('YYYY-MM-DD HH:mm')}</Typography>
                                    <Typography>End Date: {dayjs(event?.response.endDate).format('YYYY-MM-DD HH:mm')}</Typography>

                                <Divider sx={{ margin: '10px 0' }} />
                                <Typography variant="h3">Place</Typography>
                                <Typography>
                                    {`${event?.response.address} ${event?.response.houseNumber}, ${event?.response.zipCode} ${event?.response.selectedCity.name},
                                    ${event?.response.selectedState.name}, ${event?.response.selectedCountry.name}`}
                                </Typography>
                                <Divider sx={{margin: '10px 0'}}/>
                            </>
                        )}
                    </Stack>
                    <Typography variant="h3">Organized by</Typography>
                    {event ? (
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    src={getFileUrl(event?.response.organiser.profilePicturePath, "icon", "default")}
                                    onError={handleAvatarError}
                                    sx={{borderRadius: '50%', margin: '10px 0', marginRight: '10px', width: 70, height: 70}}
                                >
                                    <PersonIcon/>
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{event?.response.organiser.username}</Typography>
                                    <Link to={`/organizer-profile/${event?.response.organiser._id}`}
                                          sx={{fontSize: '16px'}}>More information</Link>

                                </Box>
                                <ChatPopupButton receiverId={event?.response.organiser._id}/>
                            </Box>
                        </Stack>
                    ) : (
                        <Avatar>
                            <PersonIcon/>
                        </Avatar>
                    )}
                    <Button variant="outlined" component={RouterLink} to={`/events/${eventID}`}>
                        View Event Details
                    </Button>
                </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={8}>
                <Box>
                    <Typography variant="h2">Apply as</Typography>
                    <Divider sx={{margin: '15px 0'}}/>

                    {volunteer.data ? (
                        <Stack direction="row" alignItems="center">
                            <Avatar
                                src={getFileUrl(volunteer.data.response.profilePicturePath, "icon", "preview")}
                                onError={handleAvatarError}
                                sx={{borderRadius: '50%', marginRight: '10px', width: 80, height: 80}}
                            >
                                <PersonIcon/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6">{volunteer.data?.response.username}</Typography>

                            </Box>
                        </Stack>


                    ) : (
                        <Avatar>
                            <PersonIcon/>
                        </Avatar>
                    )}

                    {applicationID && (
                        <>
                            <Typography variant="h3">Uploaded Files</Typography>
                            <List>
                                {files.map((file) => (
                                    <ListItem
                                        key={file.id}
                                        secondaryAction={
                                            <Stack direction="row" spacing={1}>
                                                {/*<IconButton edge="end" onClick={() => handleViewFile(file.url)}>*/}
                                                {/*    <VisibilityIcon />*/}
                                                {/*</IconButton>*/}
                                                <IconButton edge="end" onClick={() => handleFileDeletePresented(file.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Stack>
                                        }
                                    >
                                        <ListItemText primary={file.name}/>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}

                    <br/>
                    <br/>

                    <Typography variant="h2">Upload Files</Typography>
                    <Divider sx={{margin: '15px 0'}}/>
                    <Stack
                        direction={isXs ? 'column' : 'row'}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ maxWidth: '100%', maxHeight: '100%', flexGrow: 1, paddingBottom: 2 }}
                    >
                        {event && (
                            event?.response.requiredFiles.map((filetype) => (
                                    <Stack direction='column'>
                                        <Typography variant="h6">{filetype}</Typography>
                                        <FileUploadBox onURLChange={handleFilesChange} onFileDelete={handleFileDelete}
                                                       presentedFiles={presentedFiles} requiredFileType={filetype}
                                                       eventId={eventID}/>
                                    </Stack>
                                )
                            )
                        )
                        }
                        <Stack direction='column'>
                            <Typography variant="h6">Others</Typography>
                            <FileUploadBox onURLChange={handleFilesChange} onFileDelete={handleFileDelete}
                                           presentedFiles={presentedFiles} eventId={eventID}/>
                        </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="space-around" spacing={2} sx={{padding: 2}}>
                        <StyledButton variant="outlined" component={RouterLink} to={`/events/${eventID}`}> Cancel</StyledButton>
                        <StyledButton variant="outlined" onClick={() => handleApply(true)}>Save to Draft</StyledButton>
                        <StyledButton variant="contained" onClick={() => handleApply(false)}>Apply</StyledButton>
                    </Stack>
                </Box>
                    </Grid>
                </Grid>
        </Container>
)};

export default Application;
