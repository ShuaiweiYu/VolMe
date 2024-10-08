import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import NavBar from "./components/NavBar";
import PersistLogin from './redux/auth/PersistLogin';
import NoFound from "./pages/NotFound";
import UserProfile from "./pages/users/UserProfile";
import ForgotPassword from "./pages/credentials/ForgetPasswordPage";
import Application from "./pages/applications/Application"
import Events from "./pages/events/Events";
import EventPage from "./pages/events/EventPage";
import CreateEvent from "./pages/events/CreateEvent";
import MyEventsPage from "./pages/events/MyEventsPage";
import {Management} from "./pages/eventManagement/Management";
import {userType} from "./util/userType"
import LandingPage from "./pages/LandingPage";
import Box from '@mui/material/Box';
import CheckOut from "./pages/checkOut";
import Chat from "./pages/chat/Chat";
import OrganizerProfileDisplayPage from "./pages/users/OrganizerProfileDisplayPage";
import Contacts from "./components/LandingPage/Contacts";

function App() {
    return (
        <Box
            sx={(theme) => ({
                minHeight: "1500px",
                width: '100%',
                backgroundImage: 'linear-gradient(180deg, #FFFFEC, #CEFFCA)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
            })}
        >
            <Router>
                <NavBar/>
                <Routes>
                    <Route path='/' element={<LandingPage/>}/>
                    <Route path='/contact' element={<Contacts/>}/>
                    <Route path='/reset-password' element={<ForgotPassword/>}/>
                    <Route path='*' element={<NoFound/>}/>
                    <Route path='/events' element={<Events/>}/>
                    <Route path="/events/:eventID" element={<EventPage/>}/>
                    <Route path='/organizer-profile/:userId' element={<OrganizerProfileDisplayPage/>}/>
                    
                    <Route path='/profile' element={
                        <PersistLogin allowedUsers={[userType.VOLUNTEER, userType.ORGANIZER]}>
                            <UserProfile/>
                        </PersistLogin>
                    }/>

                    <Route path='/application/:eventID/:applicationID?' element={
                        <PersistLogin allowedUsers={[userType.VOLUNTEER]}>
                            <Application/>
                        </PersistLogin>
                    }/>
                    <Route path='/create-event' element={
                        <PersistLogin allowedUsers={[userType.ORGANIZER]}>
                            <CreateEvent/>
                        </PersistLogin>
                    }/>
                    <Route path='/my-events' element={
                        <PersistLogin allowedUsers={[userType.VOLUNTEER, userType.ORGANIZER]}>
                            <MyEventsPage/>
                        </PersistLogin>
                    }/>
                    <Route path="/events/management/:eventID" element={
                        <PersistLogin allowedUsers={[userType.ORGANIZER]}>
                            <Management/>
                        </PersistLogin>
                    }/>
                    <Route path="/checkout" element={
                        <PersistLogin allowedUsers={[userType.ORGANIZER]}>
                            <CheckOut/>
                        </PersistLogin>
                    }/>
                    <Route path='/chat' element={
                        <PersistLogin allowedUsers={[userType.VOLUNTEER, userType.ORGANIZER]}>
                            <Chat/>
                        </PersistLogin>
                    }/>
                </Routes>
            </Router>
        </Box>
    );
}

export default App;
