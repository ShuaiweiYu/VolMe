import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {LoginModal, SignUpModal} from "../../pages/util/LoginModal";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import {useState} from "react";
import {useSendLogoutMutation} from "../../redux/auth/authApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {useGetUserByUserIdQuery} from "../../redux/users/usersApiSlice";
import {styled} from "@mui/material";
import {useNavigate} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {useTranslation} from "react-i18next";


const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '15px',
    '&:hover': {
        backgroundColor: 'divider',
        borderColor: '#5CBC63',
    },
}));


const SideDrawer = () => {
    const {t, i18n} = useTranslation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    //------******------ LoginModal
    const [openModal, setOpenModal] = useState(false);
    const [isLoginModal, setIsLoginModal] = useState(true); // Example state for modal type

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };


    const [sendLogout] = useSendLogoutMutation()

    const userId = useSelector(selectCurrentUserId)

    const user = useGetUserByUserIdQuery(userId)

    const handleClickOpen = (state) => {
        setOpenModal(true);
        setIsLoginModal(state);
    };


    const handleAvatarError = (event) => {
        event.target.src = '/path/to/default/image';
    };

    const BootstrapDialog = styled(Dialog)(({theme}) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));


    //------******------
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    return (
        <Box>
            <StyledButton
                variant="text"
                //color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
            >
                <MenuIcon sx={{ color: '#5CBC63'}} />
            </StyledButton>
            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(24px)',
                }}
            >
                <Box
                    sx={{
                        minWidth: '40dvw',
                        p: 2,
                        //backgroundColor: 'secondary',
                        flexGrow: 1,
                        padding: '60px',
                    }}
                >
                    {userId != null ? (
                        <>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button onClick={() => handleNavigate('/my-events')}>
                                    <Typography>{t("sideDrawer.myProfile")}</Typography>
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button onClick={() => handleNavigate('/my-events')}>
                                    <Typography>{t("sideDrawer.myEvents")}</Typography>
                                </Button>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button color="error" aria-label="log out" size="small" onClick={sendLogout}>
                                    <Typography textAlign="center">{t("sideDrawer.logOut")}</Typography>
                                </Button>
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button color="error" aria-label="sign up" size="small" onClick={() => handleClickOpen(false)}>
                                    <Typography textAlign="center"> {t('navBar.signup')} </Typography>
                                </Button>
                            </MenuItem>

                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button color="error" aria-label="login" size="small" onClick={() => handleClickOpen(true)}>
                                    <Typography textAlign="center"> {t('navBar.login')} </Typography>
                                </Button>
                            </MenuItem>

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
                                    {isLoginModal ? <LoginModal handleClose={handleClose} requireNavigation={true}/> :
                                        <SignUpModal handleClose={handleClose} requireNavigation={true}/>}
                                </Box>
                            </Dialog>
                        </>
                    )}
                </Box>
            </Drawer>
        </Box>
    )
}

export default SideDrawer;