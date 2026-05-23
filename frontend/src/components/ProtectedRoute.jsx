import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects guest users to /login, preserving intended destination
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authInitialized } = useAuth();
  const location = useLocation();

  if (!authInitialized) return null; // Wait until session is restored

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
