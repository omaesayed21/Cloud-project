import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // التحقق من التوكن في localStorage
  const token = localStorage.getItem("token");

  // لو مفيش توكن، نوجه المستخدم لصفحة تسجيل الدخول
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // لو فيه توكن، نسمح بدخول المستخدم للصفحة المطلوبة
  return children;
}
