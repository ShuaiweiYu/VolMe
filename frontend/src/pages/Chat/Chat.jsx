import React, {useEffect, useState} from 'react';
import {useGetConversationOverviewQuery} from "../../redux/users/usersApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {Avatar, Button, List, ListItem, Stack, Typography} from "@mui/material";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import ChatPopup from "../../components/Chat/ChatPopup";

const Chat = () => {

    const userId = useSelector(selectCurrentUserId)

    const {data: conversationOverview, isLoading, isSuccess, refetch} = useGetConversationOverviewQuery(userId)
    const [selectedReceiverId, setSelectedReceiverId] = useState(null);

    const handleConversationClick = (receiverId) => {
        setSelectedReceiverId(receiverId);

    };
    const resetReceiverId = () => {
        setSelectedReceiverId(null);
    };


    useEffect(() => {// refetch the conversations every 2 seconds
        const interval = setInterval(() => {
            refetch();
        }, 2000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [refetch]);

    const sortedConversations = conversationOverview?.response?.slice().sort((a, b) => {
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        }
    );

    return (
        <List dense>
            {sortedConversations?.map((conversation) =>
                <ListItem>
                    <Button sx={{
                        textTransform: "none",
                        color: "black",
                        textAlign: "left",
                        width: "100%",
                    }} onClick={() => handleConversationClick(conversation.participant._id)}>
                        <Stack sx={{width: "100%"}}
                               direction="row"
                               alignItems="center"
                               spacing={2}
                        >
                            <Avatar
                                src={getFileUrl(conversation.participant.profilePicturePath, "icon", "preview")}
                            >
                                <PersonIcon/>
                            </Avatar>
                            <Stack direction="column">
                                <Typography>{conversation.participant.username}</Typography>
                                <Typography> {conversation.lastMessage.message}</Typography>
                            </Stack>
                        </Stack>
                    </Button>
                </ListItem>
            )}
            <ChatPopup receiverId={selectedReceiverId} resetReceiverId={resetReceiverId}/>
        </List>


    )


}

export default Chat;