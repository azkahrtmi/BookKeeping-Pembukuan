import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;