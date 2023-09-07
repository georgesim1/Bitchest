import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, adminRoute = false, alternative }) {
    const { user } = useAuth();

    // If the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If it's an admin route and the user type is not admin, render the alternative component
    if (adminRoute && user.usertype !== "admin") {
        return alternative;
    }

    return children;
}

export default PrivateRoute;
