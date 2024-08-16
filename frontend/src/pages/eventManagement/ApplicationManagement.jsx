import ApplicationItem from "./ApplicationItem";
import Grid from "@mui/material/Grid";
import {Accordion, AccordionDetails, AccordionSummary, Pagination, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    useGetPendingApplicationsByEventQuery,
    useGetAcceptedApplicationsByEventQuery,
    useGetDeclinedApplicationsByEventQuery
} from "../../redux/applications/applicationApiSlice"
import React, {useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const ApplicationManagement = ({eventId, eventObj}) => {
    const {t} = useTranslation();

    const [acceptedPage, setAcceptedPage] = useState(1);
    const [pendingPage, setPendingPage] = useState(1);
    const [declinePage, setDeclinePage] = useState(1);

    const {
        data: acceptedApplicationResponse,
        isFetching: isGetAcceptedApplicationFetching,
        isSuccess: isGetAcceptedApplicationSuccess,
    } = useGetAcceptedApplicationsByEventQuery({eventID: eventId, page: acceptedPage})

    const {
        data: pendingApplicationResponse,
        isFetching: isGetPendingApplicationFetching,
        isSuccess: isGetPendingApplicationSuccess,
    } = useGetPendingApplicationsByEventQuery({eventID: eventId, page: pendingPage})

    const {
        data: declinedApplicationResponse,
        isFetching: isGetDeclinedApplicationFetching,
        isSuccess: isGetDeclinedApplicationSuccess,
    } = useGetDeclinedApplicationsByEventQuery({eventID: eventId, page: declinePage})

    // todo：加一个工具栏，可以导出文件，但是要付费用户才能操作

    const peopleAmountSatisfied = isGetAcceptedApplicationSuccess ? (acceptedApplicationResponse.response.applications.length === eventObj.peopleNeeded) : false
    
    const isStarted = Date.now() > new Date(eventObj.startDate).getTime();

    return (
        <Grid container justifyContent="center" sx={{minWidth: '820px'}}>
            <Grid item sx={{width: '90%'}}>
                <Accordion defaultExpanded={isStarted} slotProps={{transition: {unmountOnExit: true}}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h5" component="div">
                            {t("applicationManagement.accept")} {isGetAcceptedApplicationSuccess ? acceptedApplicationResponse.response.applications.length : "N/A"} / {eventObj.peopleNeeded}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            {isGetAcceptedApplicationFetching ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress/>
                                </Box>
                            ) : isGetAcceptedApplicationSuccess && (
                                <>
                                    {acceptedApplicationResponse.response.applications.length === 0 && <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Typography>
                                            No accepted applications found
                                        </Typography>
                                    </Box>}
                                    {acceptedApplicationResponse.response.applications.map((application) => (
                                        <ApplicationItem key={application._id} 
                                                         application={application}
                                                         eventObj={eventObj}
                                                         peopleAmountSatisfied={peopleAmountSatisfied}
                                                         isStarted={isStarted}
                                        />
                                    ))}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Pagination
                                            count={acceptedApplicationResponse.response.pages}
                                            page={acceptedPage}
                                            onChange={(event, value) => setAcceptedPage(value)}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded={!isStarted} slotProps={{transition: {unmountOnExit: true}}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h5" component="div">
                            {t("applicationManagement.pending")}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            {isGetPendingApplicationFetching ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress/>
                                </Box>
                            ) : isGetPendingApplicationSuccess && (
                                <>
                                    {pendingApplicationResponse.response.applications.length === 0 && <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Typography>
                                            No applications to be reviwed
                                        </Typography>
                                    </Box>}
                                    {pendingApplicationResponse.response.applications.map((application) => (
                                        <ApplicationItem key={application._id}
                                                         application={application}
                                                         eventObj={eventObj}
                                                         peopleAmountSatisfied={peopleAmountSatisfied}
                                                         isStarted={isStarted}
                                        />
                                    ))}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Pagination
                                            count={pendingApplicationResponse.response.pages}
                                            page={acceptedPage}
                                            onChange={(event, value) => setAcceptedPage(value)}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion slotProps={{transition: {unmountOnExit: true}}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h5" component="div">
                            {t("applicationManagement.decline")}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            {isGetDeclinedApplicationFetching ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress/>
                                </Box>
                            ) : isGetDeclinedApplicationSuccess && (
                                <>
                                    {declinedApplicationResponse.response.applications.length === 0 && <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Typography>
                                            No declined applications found
                                        </Typography>
                                    </Box>}
                                    {declinedApplicationResponse.response.applications.map((application) => (
                                        <ApplicationItem key={application._id}
                                                         application={application}
                                                         eventObj={eventObj}
                                                         peopleAmountSatisfied={peopleAmountSatisfied}
                                                         isStarted={isStarted}
                                        />
                                    ))}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Pagination
                                            count={declinedApplicationResponse.response.pages}
                                            page={acceptedPage}
                                            onChange={(event, value) => setAcceptedPage(value)}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    )
}

export default ApplicationManagement;