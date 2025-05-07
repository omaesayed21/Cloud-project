// دالة لحفظ بيانات المستخدم في localStorage
export const saveUserData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name || data.username || "");
    localStorage.setItem("email", data.email || "");
    
    // حساب وقت انتهاء صلاحية الـ token إذا كان موجودًا
    if (data.expires_in) {
      const expiryTime = Date.now() + data.expires_in * 1000;
      localStorage.setItem("tokenExpiry", expiryTime.toString());
    }
  };
  
  // دالة لإزالة بيانات المستخدم من localStorage
  export const removeUserData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("tokenExpiry");
  };
  
  // دالة لإنشاء الأحرف الأولى من الاسم
  export const getInitials = (name) => {
    if (!name) return 'US'; // User Short (افتراضي إذا لم يكن هناك اسم)
    
    return name
      .split(' ')
      .filter(word => word.length > 0) // تجنب الكلمات الفارغة
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2); // الحد الأقصى حرفين
  };
  
  // دالة لتحديد مسار لوحة التحكم
  export const getHomePath = () => {
    return "/dashboard"; // مسار واحد للجميع
  };
  
  // دالة للتحقق من وجود مستخدم مسجل الدخول
  export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    
    return token && (!expiry || Date.now() < Number(expiry));
  };
  
  // دالة للحصول على البيانات الأساسية للمستخدم
  export const getUserData = () => {
    return {
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      initials: getInitials(localStorage.getItem("username")),
    };
  };