import { Navigate } from "react-router-dom";
import { AuthService } from "../../infrastructure/services/AuthService";

export default function PrivateRoute({ children }) {
  const isAuth = AuthService.isAuthenticated();

  return isAuth ? children : <Navigate to="/login" replace />;
}
