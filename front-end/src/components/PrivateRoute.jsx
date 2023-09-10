import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, adminRoute = false, alternative }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminRoute && user.usertype !== "admin") {
        return alternative;
    }

    return children;
}

export default PrivateRoute;
