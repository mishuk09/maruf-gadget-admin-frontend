import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    // Check if token exists and is not expired
    if (!token) {
        return <Navigate to="/signin" />;
    }

    // Decode token and check expiration
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (payload.exp && payload.exp < currentTime) {
            // Token expired
            localStorage.removeItem("token");
            return <Navigate to="/signin" />;
        }

        return <Outlet />;
    } catch (error) {
        // Invalid token format
        localStorage.removeItem("token");
        return <Navigate to="/signin" />;
    }
};

export default ProtectedRoute;
