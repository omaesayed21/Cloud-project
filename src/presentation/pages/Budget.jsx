import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit2, Trash2, Calendar, DollarSign, Tag, RefreshCw } from "lucide-react";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../../infrastructure/services/BudgetService";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category_id: "",
    category_name: "",
    amount: "",
    start_date: "",
    end_date: "",
    category_type: "income",
    color: "#10b981",
    isNewCategory: false
  });
  const [editMode, setEditMode] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [forecast, setForecast] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getBudgets(token)
      .then(setBudgets)
      .catch(() => setError("Error loading data"))
      .finally(() => setLoading(false));

    axios
      .get("http://127.0.0.1:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setCategories(res.data))
      .catch(() => setError("Error loading categories"));
  }, [navigate, token]);

  const handleCreateBudget = () => {
    if (!token) return navigate("/login");

    const payload = newBudget.isNewCategory
      ? {
          category_name: newBudget.category_name,
          amount: newBudget.amount,
          start_date: newBudget.start_date,
          end_date: newBudget.end_date,
          category_type: newBudget.category_type,
          color: newBudget.color
        }
      : {
          category_id: newBudget.category_id,
          amount: newBudget.amount,
          start_date: newBudget.start_date,
          end_date: newBudget.end_date
        };

    createBudget(payload, token)
      .then(() => {
        toast.success("Budget created successfully!");
        getBudgets(token)
          .then(setBudgets)
          .catch(() => setError("Error fetching budgets"));
        resetForm();
      })
      .catch(() => {
        toast.error("Error creating budget");
        setError("Error creating budget");
      });
  };

  const handleEditBudget = (budget) => {
    setEditMode(true);
    setEditBudget(budget);
    setNewBudget({
      category_id: budget.category_id || "",
      category_name: budget.category_name || "",
      amount: budget.amount,
      start_date: budget.start_date,
      end_date: budget.end_date,
      category_type: budget.category_type || "income",
      color: budget.category_color || "#10b981",
      isNewCategory: false
    });
    setIsFormOpen(true);
    window.scrollTo(0, 0);
  };

  const handleUpdateBudget = () => {
    if (!token) return navigate("/login");

    const payload = {
      category_id: newBudget.category_id,
      category_name: newBudget.category_name,
      amount: newBudget.amount,
      start_date: newBudget.start_date,
      end_date: newBudget.end_date,
      category_type: newBudget.category_type,
      color: newBudget.color
    };

    updateBudget(editBudget.id, payload, token)
      .then((data) => {
        toast.success("Budget updated successfully!");
        setBudgets((prev) =>
          prev.map((b) => (b.id === editBudget.id ? data : b))
        );
        resetForm();
      })
      .catch(() => {
        toast.error("Error updating budget");
        setError("Error updating budget");
      });
  };

  const handleDeleteBudget = (id) => {
    if (!token) return navigate("/login");

    deleteBudget(id, token)
      .then(() => {
        toast.success("Budget deleted successfully!");
        setBudgets(budgets.filter((b) => b.id !== id));
      })
      .catch(() => {
        toast.error("Error deleting budget");
        setError("Error deleting budget");
      });
  };

  const resetForm = () => {
    setEditMode(false);
    setEditBudget(null);
    setIsFormOpen(false);
    setNewBudget({
      category_id: "",
      category_name: "",
      amount: "",
      start_date: "",
      end_date: "",
      category_type: "income",
      color: "#10b981",
      isNewCategory: false
    });
  };

  const calculateTotal = (type) => {
    return budgets
      .filter((b) => type === "all" || b.category_type === type)
      .reduce((total, b) => total + Number(b.amount), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Toaster />
        <div className="flex flex-col items-center">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Toaster />
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 rtl">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Budget Management</h1>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <PlusCircle className="w-5 h-5 ml-2" />
              {isFormOpen ? "Close Form" : "Add New Budget"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-lg font-medium mb-1">Total Budget</h3>
              <p className="text-2xl font-bold">{calculateTotal("all")} EGP</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-lg font-medium mb-1">Total Income</h3>
              <p className="text-2xl font-bold">{calculateTotal("income")} EGP</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-lg font-medium mb-1">Total Expenses</h3>
              <p className="text-2xl font-bold">{calculateTotal("expense")} EGP</p>
            </div>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              {editMode ? "Edit Budget" : "Add New Budget"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
                  <select
                    value={newBudget.isNewCategory ? "new" : "existing"}
                    onChange={(e) =>
                      setNewBudget({
                        ...newBudget,
                        isNewCategory: e.target.value === "new",
                        category_id: "",
                        category_name: ""
                      })
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="existing">Existing Category</option>
                    <option value="new">New Category</option>
                  </select>
                </div>
              )}

              {editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <div className="relative">
                      <Tag className="absolute right-3 top-3 text-gray-500" size={18} />
                      <input
                        type="text"
                        value={newBudget.category_name}
                        onChange={(e) => setNewBudget({ ...newBudget, category_name: e.target.value })}
                        placeholder="Example: Salary, Rent"
                        className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
                    <select
                      value={newBudget.category_type}
                      onChange={(e) => setNewBudget({ ...newBudget, category_type: e.target.value })}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={newBudget.color}
                        onChange={(e) => setNewBudget({ ...newBudget, color: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-600">{newBudget.color}</span>
                    </div>
                  </div>
                </>
              ) : newBudget.isNewCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <div className="relative">
                      <Tag className="absolute right-3 top-3 text-gray-500" size={18} />
                      <input
                        type="text"
                        value={newBudget.category_name}
                        onChange={(e) => setNewBudget({ ...newBudget, category_name: e.target.value })}
                        placeholder="Example: Salary, Rent"
                        className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
                    <select
                      value={newBudget.category_type}
                      onChange={(e) => setNewBudget({ ...newBudget, category_type: e.target.value })}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={newBudget.color}
                        onChange={(e) => setNewBudget({ ...newBudget, color: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-600">{newBudget.color}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newBudget.category_id}
                    onChange={(e) => setNewBudget({ ...newBudget, category_id: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    placeholder="0.00"
                    className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input
                    type="date"
                    value={newBudget.start_date}
                    onChange={(e) => setNewBudget({ ...newBudget, start_date: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input
                    type="date"
                    value={newBudget.end_date}
                    onChange={(e) => setNewBudget({ ...newBudget, end_date: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              {editMode ? (
                <button
                  onClick={handleUpdateBudget}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleCreateBudget}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">All Budgets</h2>

          {budgets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No budgets found. Add a new budget to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  style={{ borderTop: `4px solid ${budget.category_color}` }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{budget.category_name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          budget.category_type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {budget.category_type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>

                    <p className="text-md font-bold mt-2 text-gray-500">{budget.amount} EGP</p>

                    <div className="mt-3 text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 ml-1" />
                        <span>From: {budget.start_date}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 ml-1" />
                        <span>To: {budget.end_date}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}