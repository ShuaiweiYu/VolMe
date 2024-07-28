import React, {useEffect, useState} from 'react';
import {ChatItem} from "./ChatItem";
import Box from "@mui/material/Box";
import {Avatar, Button, Modal, Stack, Typography} from "@mui/material";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {getFileUrl} from "../../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from '@mui/icons-material/Chat';

const ChatPopupButton = ({receiverId}) => {
    const [open, setOpen] = useState(false);


    const receiver = useGetUserByUserIdQuery(receiverId)

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
    };
    const handleAvatarError = (event) => {
        event.target.src = '/path/to/default/image';
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<ChatIcon/>}>
                Chat
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{paddingBottom: 1}}>
                        <Avatar
                            src={getFileUrl(receiver?.data?.response.profilePicturePath, "icon", "preview")}
                            onError={handleAvatarError}
                        >
                            <PersonIcon/>
                        </Avatar>
                        <Typography variant="h3">{receiver?.data?.response.username}</Typography>
                    </Stack>
                    <ChatItem receiverId={receiverId}/>
                </Box>
            </Modal>
        </>
    );
}

export default ChatPopupButton