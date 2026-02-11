import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Jab tak backend se 'me' ka response na aaye, pulse dikhao
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-3xl font-black text-blue-600 animate-pulse italic">DawaKhoj+</div>
        <p className="text-gray-400 text-sm mt-2">Securing your session...</p>
      </div>
    );
  }

  // Agar loading khatam ho gayi aur user nahi mila, toh Login par bhejo
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;