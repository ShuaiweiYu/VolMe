import { useEffect, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import Alert from '@mui/material/Alert';
import { LoginModal } from "../../pages/util/LoginModal";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorComponent from "../../components/ErrorComponent";
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";
import useRole from "./useRole";
import {jwtDecode} from "jwt-decode";

const PersistLogin = ({ children, allowedUsers }) => {
    const token = useSelector(selectCurrentToken)
    const {role} = useRole()

    const [trueSuccess, setTrueSuccess] = useState(false)
    const [errorType, setErrorType] = useState(null);

    const {t} = useTranslation();

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError
    }] = useRefreshMutation()

    useEffect(() => {
        if (token === null) {
            setErrorType('notLoggedIn');
        }

        const isTokenExpired = (token) => {
            const { exp } = jwtDecode(token);
            return Date.now() >= exp * 1000;
        }

        const verifyRefreshToken = async () => {
            try {
                await refresh()
                setTrueSuccess(true)
            } catch (err) {
                console.error(err)
                setErrorType('sessionExpired');
            }
        }

        if (token) {
            if (isTokenExpired(token)) {
                verifyRefreshToken();
            } else {
                setTrueSuccess(true);
            }
        } else {
            setErrorType('notLoggedIn');
        }
    }, [token, refresh])

    if (isLoading) {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ height: '100vh' }} // 全屏高度
            >
                <CircularProgress size={80} />
            </Grid>
        );
    } else if (isError || errorType) {
        return (
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: '100vh', overflow: 'auto' }}
            >
                    {errorType === 'sessionExpired' && (
                        <Alert severity="warning">{t("PersistLogin.sessionExpired")}</Alert>
                    )}
                    {errorType === 'notLoggedIn' && (
                        <Alert severity="info">{t("PersistLogin.notLoggedIn")}</Alert>
                    )}
                    <LoginModal requireNavigation={true} />
            </Grid>
        )
    } else if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
        if (!allowedUsers) {
            return children
        } else if ( allowedUsers.includes(role)) {
            return children
        } else {
            return <ErrorComponent message={t("PersistLogin.noAccess")}/>
        }
    }
    return null
}

export default PersistLogin
