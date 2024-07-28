import * as React from "react";
    import { useTranslation } from 'react-i18next';
import { Box, } from "@mui/material";
import Stack from "@mui/material/Stack";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import FeedOrganiser from "../../components/MyEventsPage/FeedOrganiser";
import FeedVolunteer from "../../components/MyEventsPage/FeedVolunteer";


function MyEventsPage() {
    const { t, i18n } = useTranslation();
    const userId = useSelector(selectCurrentUserId);
    const { data: user, isSuccess,error, isLoading } = useGetUserByUserIdQuery(userId);


    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };


    return (
        <Box id="my-events" >
            <Stack direction="row" spacing={2} justifyContent="space-between">
                {user?.response.role === 'VOLUNTEER' && (
                    <FeedVolunteer  />
                )}
                {user?.response.role === 'ORGANIZER' && (
                    <FeedOrganiser />
                )}
            </Stack>
        </Box>
    );
}

export default MyEventsPage;