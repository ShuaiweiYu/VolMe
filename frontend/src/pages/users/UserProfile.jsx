import { useGetUserByUserIdQuery } from '../../redux/users/usersApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/auth/authSlice';
import VolunteerProfilePage from './VolunteerProfilePage';
import OrganizerProfilePage from './OrganizerProfilePage';
import ErrorComponent from "../../components/ErrorComponent";
import LoadingComponent from "../../components/LoadingComponent";
// todo: add introduction

const UserProfilePageContainer = () => {
    const userId = useSelector(selectCurrentUserId);
    const { data: user, error, isLoading } = useGetUserByUserIdQuery(userId);

    if (isLoading) {
        return <LoadingComponent/>
    }

    if (error) {
        return <ErrorComponent message={error.message}/>
    }

    const userData = user?.response;

    if (!userData) {
        return <ErrorComponent message={"User data not found"}/>
    }

    return (
        <div className="UserProfilePageContainer">
            {userData.role === 'VOLUNTEER' && (
                <VolunteerProfilePage userId={userId} />
            )}
            {userData.role === 'ORGANIZER' && (
                <OrganizerProfilePage userId={userId} />
            )}
        </div>
    );
}

export default UserProfilePageContainer;
