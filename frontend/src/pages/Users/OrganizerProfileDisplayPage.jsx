import React, { useEffect, useState } from 'react';
import {
    useGetUserByUserIdQuery,
} from '../../redux/users/usersApiSlice';
import {
    Typography,
    Paper,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Avatar, Grid, Button, TextField,
} from '@mui/material';
import { Country, State, City } from 'country-state-city';
import { getFileUrl } from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import {useParams} from "react-router-dom";
import {useDeleteDocumentMutation, useGetDocumentByIdQuery} from "../../redux/documents/documentApiSlice";
import PdfModal from "../../util/PdfModal";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {useTranslation} from "react-i18next";

const OrganizerProfileDisplayPage = () => {
    const { userId } = useParams();
    const { data: user, isLoading, error } = useGetUserByUserIdQuery(userId);
    const [initialUserData, setInitialUserData] = useState(null);
    const [profilePicturePath, setProfilePicturePath] = useState(null);
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const {t} = useTranslation();

    function DocumentDetails({ documentId }) {
        const { data: document, isLoading, isError } = useGetDocumentByIdQuery(documentId);
        const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

        if (isLoading) return <Typography variant="h6">Loading...</Typography>;
        if (isError || !document) return <Typography variant="h6">Error loading document</Typography>;

        return (
            <Grid item xs={12} sm={4}>
                <PdfModal
                    title={"authentication_document"}
                    file={getFileUrl(document.response.path, 'pdf', 'original')}
                    renderMessage={'View Only'}
                />
            </Grid>
        );
    }

    useEffect(() => {
        if (user && user.response) {
            setInitialUserData(user.response);
            setProfilePicturePath(user.response.profilePicturePath || null);
            setCountry(Country.getCountryByCode(user.response.country) || null);
            setState(State.getStateByCodeAndCountry(user.response.state, user.response.country) || null);
            setCity(City.getCitiesOfState(user.response.country, user.response.state).find(city => city.name === user.response.city) || null);
        }
    }, [user]);

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error: {error.message}</Alert>;
    if (!user || !user.response) return <Alert severity="info">No user data found</Alert>;
    if (!initialUserData) return <CircularProgress />;

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h2" gutterBottom>
                    {t("profile.organizerProfile")}
                </Typography>

                <Divider />

                {/* Profile Picture */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                >
                    <Avatar
                        src={getFileUrl(profilePicturePath, 'icon', 'display')}
                        sx={{ width: 120, height: 120 }}
                    >
                        <PersonIcon />
                    </Avatar>
                </Box>

                {/* Username */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.username")}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ paddingLeft: 2 }}>
                        {initialUserData.username}
                    </Typography>
                </Box>

                <Divider />

                {/* Email Address */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.email")}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ paddingLeft: 2 }}>
                        {initialUserData.emailAddress}
                    </Typography>
                </Box>

                <Divider />

                {/* Organization Name */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.organizationName")}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ paddingLeft: 2 }}>
                        {initialUserData.organizationName}
                    </Typography>
                </Box>

                <Divider />
                {/* Contact Address */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.contactAddress")}</strong>
                    </Typography>
                    <Box sx={{ paddingLeft: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'grey' }}>{t("profile.address")}:</span> {initialUserData.address || 'Not provided'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'grey' }}>{t("profile.postalCode")}:</span> {initialUserData.postalCode || 'Not provided'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'grey' }}>{t("profile.city")}:</span> {city ? city.name : ''}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'grey' }}>{t("profile.state")}:</span> {state ? state.name : ''}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'grey' }}>{t("profile.country")}:</span> {country ? country.name : ''}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Average Rating */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.averageRating")}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ paddingLeft: 2 }}>
                        {initialUserData.averageRating === -1 ? 'No rating available' : initialUserData.averageRating}
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ marginTop: 3}}>
                    {/* Display PdfModal for each file */}
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>{t("profile.authView")}:</strong>
                    </Typography>
                    {initialUserData.files.map(documentId => (
                        <DocumentDetails key={documentId} documentId={documentId} />
                    ))}
                </Box>

            </Paper>
        </Box>
    );
};

export default OrganizerProfileDisplayPage;
