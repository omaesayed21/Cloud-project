export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");
  
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
  
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // هنا نتأكد من أن الأخطاء يتم معالجتها بشكل جيد
        throw new Error(errorData.message || "Request failed");
      }
  
      return response.json();
    } catch (error) {
      // إذا حدث خطأ في الطلب نفسه
      throw new Error("Network error: " + error.message);
    }
  }
  