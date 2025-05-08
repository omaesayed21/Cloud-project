// src/services/budgetServices.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/budgets';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const getBudgets = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error loading budgets');
  }
};

const createBudget = async (newBudget, token) => {
  try {
    const response = await axios.post(API_URL, newBudget, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error creating budget');
  }
};

const updateBudget = async (id, updatedBudget, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedBudget, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error updating budget');
  }
};

const deleteBudget = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Error deleting budget');
  }
};

export { getBudgets, createBudget, updateBudget, deleteBudget };
