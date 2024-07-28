import React, {useEffect, useRef, useState} from 'react';
import {Typography, Stack, Button, TextField} from '@mui/material';
import Box from "@mui/material/Box";
import {ThemeProvider} from "@mui/material/styles";
import volmeTheme from "../../theme";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {useGetMessagesQuery, useSendMessageMutation} from "../../redux/message/messageApiSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";

export const ChatItem = ({receiverId}) => {
    // const [searchTermProp, setSearchTermProp] = useState('');
    const userId = useSelector(selectCurrentUserId)
    const [sendMessage] = useSendMessageMutation()
    const {data: messagesData, error, isLoading, isSuccess, refetch} = useGetMessagesQuery(receiverId);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const receiver = useGetUserByUserIdQuery(receiverId)
    const [content, setContent] = useState("");


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }

    };
    const handleSend = async () => {
        try {
            await sendMessage({id: receiverId, message: {"message": content}});
            setContent("");
            refetch();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (isSuccess && messagesData) {
            setMessages(messagesData.response);
        }
    }, [isSuccess, messagesData]);

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);


    return (
        <ThemeProvider theme={volmeTheme}>
            <Stack spacing={2} direction="column" alignItems="center"
                   sx={{width: '100%', maxWidth: '600px', margin: 'auto'}}>
                <Box sx={{
                    width: '100%',
                    height: '400px',
                    overflowY: 'scroll',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    '&::-webkit-scrollbar': {
                        width: '9px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#A1E8A1',
                        borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#136C13',
                        borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#042F04',
                    },
                }}>
                    {isSuccess && messages.map((m, index) =>
                        <Box key={index} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: userId === m.senderId ? '#e0f7fa' : '#fff',
                            alignSelf: userId === m.senderId ? 'flex-end' : 'flex-start',
                            borderRadius: '10px',
                            maxWidth: '80%',

                        }}>
                            <Typography variant="body2" sx={{color: '#555'}}>
                                {m.senderId === userId ? 'You' : receiver.data?.response.username}
                            </Typography>
                            <Typography variant="body1">
                                {m.message}
                            </Typography>
                        </Box>
                    )}
                    <div ref={messagesEndRef}/>
                </Box>


                <Stack direction="row" space={2} sx={{
                    width: '100%',
                    height: '100%',
                    padding: '10px',
                    display: "flex",
                    justifyContent: "space-around"
                }}>

                    <TextField
                        placeholder="Type something..."
                        value={content}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setContent(e.target.value)
                        }}
                        fullWidth
                    />
                    <Button onClick={handleSend} endIcon={<SendOutlinedIcon/>}>
                    </Button>
                </Stack>
            </Stack>
        </ThemeProvider>
    )
}

