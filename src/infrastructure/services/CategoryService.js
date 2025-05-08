const BASE_URL = "http://127.0.0.1:8000/api/categories";

export const CategoryService = {
  async getCategories(token) {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },
};
