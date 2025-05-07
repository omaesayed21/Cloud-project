import axios from "axios";
import toast from "react-hot-toast";
import { removeUserData } from "../utils/functions";

// إنشاء نسخة مخصصة من axios مع إعدادات الأساس
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// متغير للتحكم في محاولات إعادة الاتصال
let isRefreshing = false;
let failedRequests = [];

// interceptor للطلبات الصادرة
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token) {
      // إذا كان الـ token منتهي الصلاحية
      if (Date.now() > Number(tokenExpiry)) {
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/api/auth/refresh",
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const newToken = response.data.token;
            const newExpiry = (Date.now() + response.data.expires_in * 1000).toString();

            localStorage.setItem("token", newToken);
            localStorage.setItem("tokenExpiry", newExpiry);

            // تحديث الطلبات الفاشلة
            failedRequests.forEach((req) => req.resolve(newToken));
            failedRequests = [];
            
            config.headers.Authorization = `Bearer ${newToken}`;
          } catch (error) {
            failedRequests.forEach((req) => req.reject(error));
            failedRequests = [];
            
            handleAuthError(error);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // إذا كان هناك عملية تجديد جارية، نؤجل الطلب
          return new Promise((resolve, reject) => {
            failedRequests.push({ resolve, reject });
          }).then((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          }).catch((error) => {
            return Promise.reject(error);
          });
        }
      } else {
        // إذا كان الـ token ساري المفعول
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor للردود الواردة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleAuthError(error);
    }
    return Promise.reject(error);
  }
);

// دالة معالجة أخطاء المصادقة
function handleAuthError(error) {
  console.error("Authentication error:", error);
  removeUserData();
  
  // عرض رسالة خطأ مناسبة
  if (error.response) {
    const message = error.response.data.message || "Session expired. Please login again";
    toast.error(message);
  } else {
    toast.error("Network error. Please check your connection.");
  }
  
  // إعادة التوجيه لصفحة تسجيل الدخول
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// دالة للتحقق من صلاحية الـ token بشكل دوري
const setupTokenCheck = () => {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && Date.now() > Number(expiry)) {
      removeUserData();
      toast.error("Your session has expired. Please login again.");
      window.location.href = "/login";
    }
  };

  // التحقق عند تحميل الصفحة
  window.addEventListener("load", checkToken);
  
  // التحقق كل 5 دقائق
  setInterval(checkToken, 5 * 60 * 1000);
};

setupTokenCheck();

export default api;