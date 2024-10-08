import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken)

    if (token) {
        const decoded = jwtDecode(token)
        const { exp } = jwtDecode(token)
        if (Date.Now() < exp * 1000) {
            return true
        } else {
        //     todo: get refresh token或者尝试发一个请求刷新
            
            return false
        }
    } else {
        return false;
    }
}
export default useAuth