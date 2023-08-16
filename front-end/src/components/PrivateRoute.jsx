import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
    let { user } = useAuth();
    let navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    return children;
}

export default PrivateRoute;