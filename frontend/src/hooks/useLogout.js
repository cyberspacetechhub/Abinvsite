import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useLogout = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        setAuth({});

        try {
            await axios.get('/logout', 
                { withCredentials: true });

        } catch (error) {
            toast.error('Logout failed. Please try again.');
            // console.error('Logout failed:', error);
        }
    };

    return logout;
};

export default useLogout;
