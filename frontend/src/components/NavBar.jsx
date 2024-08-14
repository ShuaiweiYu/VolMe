import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Drawer, styled} from "@mui/material";
import {Chat as ChatIcon} from "@mui/icons-material";
import {useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import {LoginModal, SignUpModal} from "../pages/util/LoginModal";
import Dialog from "@mui/material/Dialog";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUserId} from "../redux/auth/authSlice";
import {getFileUrl} from "../util/fileUploaderWrapper";
import PersonIcon from "@mui/icons-material/Person";
import {useGetUserByUserIdQuery} from "../redux/users/usersApiSlice";
import {useSendLogoutMutation} from "../redux/auth/authApiSlice";
import Chat from "../pages/Chat/Chat";
import {useTranslation} from "react-i18next";
import LogoutIcon from '@mui/icons-material/Logout';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Wishlist from "../pages/Wishlist";
import {closeWishlistDrawer, openWishlistDrawer, selectCurrentWishlistStatus} from "../redux/wishlist/wishlistSlice";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    flexShrink: 0,
    bgcolor:
        theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(24px)',
    maxHeight: 40,
    borderBottom: '1px solid',
}));

const Icons = styled(Box)(({theme}) => ({
    display: "none",
    alignItems: "center",
    gap: "20px",
    [theme.breakpoints.up("sm")]: {
        display: "flex",
    },
}));

const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: '15px',
    '&:hover': {
        backgroundColor: 'divider',
        borderColor: '#5CBC63',
    },
}));

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
    borderRadius: '15px',
    '&:hover': {
        backgroundColor: 'divider',
        borderColor: '#5CBC63',
    },
}));

function NavBar() {
    const dispatch = useDispatch();

    const {t, i18n} = useTranslation();

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElLng, setAnchorElLng] = React.useState(null);
    const [anchorElMessage, setAnchorElMessage] = React.useState(null);

    useEffect(() => {
        const lang = localStorage.getItem("lang");
        if (lang !== null) {
            i18n.changeLanguage(lang);
        }
    }, []);

    const changeLanguage = (lang) => {
        if (lang === "en") {
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en")
        } else if (lang === "de") {
            i18n.changeLanguage("de");
            localStorage.setItem("lang", "de")
        } else if (lang === "cn_ZH") {
            i18n.changeLanguage("cn_ZH");
            localStorage.setItem("lang", "cn_ZH")
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenMessagesMenu = (event) => {
        setAnchorElMessage(event.currentTarget);

    }

    const handleCloseMessagesMenu = () => {
        setAnchorElMessage(null);
    };

    const handleOpenLanguageMenu = (event) => {
        setAnchorElLng(event.currentTarget);

    }

    const handleCloseLanguageMenu = () => {
        setAnchorElLng(null);
    };

    //------******------ LoginModal
    const [openModal, setOpenModal] = useState(false);
    const [isLoginModal, setIsLoginModal] = useState(true);

    const handleClose = () => {
        setOpenModal(false);
    };

    const [sendLogout] = useSendLogoutMutation()

    const userId = useSelector(selectCurrentUserId)

    const user = useGetUserByUserIdQuery(userId, {skip: userId === null || userId === undefined})

    const handleClickOpen = (state) => {
        setOpenModal(true);
        setIsLoginModal(state);
    };

    //------******------

    //------******------ wishlist
    const wishlishDrawerIsOpen = useSelector(selectCurrentWishlistStatus)

    const toggleDrawer = () => async () => {
        // todo: this won't work
        if (wishlishDrawerIsOpen) {
            await dispatch(closeWishlistDrawer())
        } else {
            await dispatch(openWishlistDrawer())
        }
    };

    const WishlistDrawer = () => {
        return (
            <Box sx={{width: '600px', marginTop: '65px'}} role="presentation">
                <Wishlist/>
            </Box>
        )
    }

    //------******------

    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 2,
                padding: 0,
                margin: 0,
            }}
        >
            <StyledToolbar sx={{borderBottomColor: 'divider'}}>
                <Box
                    sx={{
                        flexGrow: 0.05,
                        display: {xs: 'none', md: 'flex'},
                    }}
                >
                    <StyledButton>
                        <Typography
                            variant="h5"
                            noWrap
                            onClick={() => {
                                navigate("/");
                            }}
                            sx={{
                                fontFamily: 'PT Sans',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#5CBC63',
                                alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            VolME
                        </Typography>
                    </StyledButton>
                </Box>

                <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'flex'}}}>
                    <StyledMenuItem key="Events"
                                    onClick={() => {
                                        navigate("/Events");
                                    }}
                                    sx={{py: '6px', px: '12px'}}
                    >
                        <Typography variant="body2" color="#5CBC63">
                            {t("navBar.events")}
                        </Typography>
                    </StyledMenuItem>
                    <StyledMenuItem key="contact"
                                    onClick={() => {
                                        navigate("/contact");
                                    }}
                                    sx={{py: '6px', px: '12px'}}
                    >
                        <Typography variant="body2" color="#5CBC63">
                            {t("navBar.contact")}
                        </Typography>
                    </StyledMenuItem>
                </Box>

                <Box sx={{flexGrow: 0.05, display: {xs: 'none', md: 'flex'}}}>
                    <Button onClick={handleOpenLanguageMenu}>
                        <GTranslateIcon/>
                    </Button>

                    {(userId !== "null" && userId !== "undefined" && userId) ? (
                        <Icons>
                            {/*<IconButton sx={{padding: 0}} onClick={handleOpenMessagesMenu}>*/}
                            {/*    <ChatIcon color="action"/>*/}
                            {/*</IconButton>*/}
                            <IconButton onClick={toggleDrawer}>
                                {wishlishDrawerIsOpen ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                            </IconButton>

                            <Drawer anchor={"right"} open={wishlishDrawerIsOpen} onClose={toggleDrawer}>
                                <WishlistDrawer/>
                            </Drawer>

                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu}>
                                    <Avatar
                                        src={getFileUrl(user.data?.response.profilePicturePath, "icon", "preview")}
                                    >
                                        <PersonIcon/>
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </Icons>

                    ) : (
                        <Box
                            sx={{
                                display: {xs: 'flex', md: 'flex'},
                                gap: 0.5,
                                alignItems: 'center',
                            }}
                        >
                            <StyledButton
                                onClick={() => handleClickOpen(false)}
                                sx={{
                                    color: '#5CBC63',
                                    fontFamily: 'PT Sans',
                                    fontSize: 12,
                                }}
                            >
                                {t('navBar.signup')}
                            </StyledButton>

                            <StyledButton
                                size="small"
                                variant="outlined"
                                onClick={() => handleClickOpen(true)}
                                sx={{
                                    color: '#5cbc63',
                                    fontFamily: 'PT Sans',
                                    borderRadius: '900px',
                                    borderColor: '#5CBC63',
                                    fontWeight: 600,
                                }}
                            >
                                {t('navBar.login')}
                            </StyledButton>

                            <Dialog
                                onClose={handleClose}
                                aria-labelledby="customized-dialog-title"
                                open={openModal}
                                sx={{
                                    borderRadius: '15px',
                                    backdropFilter: 'blur(24px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                }}
                            >
                                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                                    {isLoginModal ? t('navBar.login') : t('navBar.signup')}
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseIcon/>
                                </IconButton>
                                <Box>
                                    {isLoginModal ?
                                        <LoginModal handleClose={handleClose} requireNavigation={false}/> :
                                        <SignUpModal handleClose={handleClose} requireNavigation={true}/>}
                                </Box>
                            </Dialog>
                        </Box>
                    )}
                </Box>

                <Box
                    variant="h7"
                    sx={{
                        flexGrow: 0,
                        display: {xs: 'none', md: 'flex'},
                    }}
                >
                    <Menu
                        anchorEl={anchorElLng}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElLng)}
                        onClose={handleCloseLanguageMenu}
                        sx={{
                            mt: '45px',
                            fontFamily: 'PT Sans',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MenuItem key="en" onClick={handleCloseLanguageMenu}>
                            <Button onClick={() => changeLanguage("en")}>
                                <Typography textAlign="center">English</Typography>
                            </Button>
                        </MenuItem>
                        <MenuItem key="de" onClick={handleCloseLanguageMenu}>
                            <Button onClick={() => changeLanguage("de")}>
                                <Typography textAlign="center">Deutsch</Typography>
                            </Button>
                        </MenuItem>
                        <MenuItem key="cn" onClick={handleCloseLanguageMenu}>
                            <Button onClick={() => changeLanguage("cn_ZH")}>
                                <Typography textAlign="center">简体中文</Typography>
                            </Button>
                        </MenuItem>
                    </Menu>
                </Box>

                <Box
                    variant="h7"
                    sx={{
                        flexGrow: 0,
                        display: {xs: 'none', md: 'flex'},
                    }}
                >
                    <Menu
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        sx={{
                            mt: '45px',
                            fontFamily: 'PT Sans',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {(userId !== "null" && userId !== "undefined" && userId) && (
                            [
                                <MenuItem key="profile" onClick={handleCloseUserMenu}>
                                    <Button onClick={() => handleNavigate('/profile')}>
                                        <Typography textAlign="center">{t('navBar.myProfile')}</Typography>
                                    </Button>
                                </MenuItem>,
                                <MenuItem key="my-events" onClick={handleCloseUserMenu}>
                                    <Button onClick={() => handleNavigate('/my-events')}>
                                        <Typography textAlign="center">{t('navBar.myEvents')}</Typography>
                                    </Button>
                                </MenuItem>,
                                <MenuItem key="sendLogout" onClick={sendLogout}>
                                    <Button onClick={sendLogout}>
                                        <Typography textAlign="center">{t('navBar.logOut')}</Typography>
                                        <LogoutIcon/>
                                    </Button>
                                </MenuItem>
                            ]
                        )}
                    </Menu>

                </Box>

                {/*<Box*/}
                {/*    variant="h7"*/}
                {/*    sx={{*/}
                {/*        flexGrow: 0,*/}
                {/*        display: {xs: 'none', md: 'flex'},*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Menu*/}
                {/*        anchorEl={anchorElMessage}*/}
                {/*        anchorOrigin={{*/}
                {/*            vertical: 'top',*/}
                {/*            horizontal: 'right',*/}
                {/*        }}*/}
                {/*        keepMounted*/}
                {/*        transformOrigin={{*/}
                {/*            vertical: 'top',*/}
                {/*            horizontal: 'right',*/}
                {/*        }}*/}
                {/*        open={Boolean(anchorElMessage)}*/}
                {/*        onClose={handleCloseMessagesMenu}*/}
                {/*        sx={{*/}
                {/*            mt: '45px',*/}
                {/*            fontFamily: 'PT Sans',*/}
                {/*            alignItems: 'center',*/}
                {/*            justifyContent: 'center',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {(userId !== "null" && userId !== "undefined" && userId) &&*/}
                {/*            <Chat/>}*/}
                {/*    </Menu>*/}
                {/*</Box>*/}

            </StyledToolbar>
        </AppBar>
    );
}

export default NavBar;

