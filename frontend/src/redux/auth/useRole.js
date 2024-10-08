import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import { jwtDecode } from 'jwt-decode';

const useRole = () => {
    const token = useSelector(selectCurrentToken)

    if (token) {
        const decoded = jwtDecode(token)
        const { role } = decoded.UserInfo

        return { role: role }
    }

    return { role: "" }
}
export default useRole