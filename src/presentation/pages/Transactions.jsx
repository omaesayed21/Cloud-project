import { useEffect, useRef, useState } from "react";
import { TransactionService } from "../../infrastructure/services/TransactionService";
import { transactionSchema } from "../hooks/useFormValidation";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { getWallets } from "../../infrastructure/services/WalletService";
import { CategoryService } from "../../infrastructure/services/CategoryService";
import TransactionsSection from "../components/TransactionsSection";

export default function Transactions() {
  const formikRef = useRef(null);
  const [wallets, setWallets] = useState([]);
  const [txs, setTxs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load transactions and wallets data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const txData = await TransactionService.getTransactions(token);
        const walletData = await getWallets(token);
        const categoryData = await CategoryService.getCategories(token);
        setTxs(txData);
        setWallets(walletData);
        setCategories(categoryData); // Expecting [{ id: 1, name: "Food" }, ...]
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const tx = {
      account_id: parseInt(values.walletId),
      category_id: parseInt(values.category_id),
      amount: parseFloat(values.amount),
      type: values.type, // Use form value
      date: values.date,
      payee: values.title,
      // Optionally include for recurring transactions
      frequency: values.frequency || null,
      end_date: values.end_date || null,
    };

    try {
      const token = localStorage.getItem("token");
      if (editId !== null) {
        await TransactionService.updateTransaction(editId, tx, token);
        toast.success("Transaction updated");
      } else {
        await TransactionService.addTransaction(tx, token);
        toast.success("Transaction added");
      }
      setTxs(await TransactionService.getTransactions(token));
      setSubmitting(false);
      setEditId(null);
      formikRef.current?.resetForm();
    } catch (err) {
      let errorMessage = "An error occurred while saving the transaction.";
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(", ");
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    setEditId(tx.id);
    if (formikRef.current) {
      formikRef.current.setValues({
        title: tx.payee || "",
        amount: tx.amount,
        date: tx.date,
        category_id: tx.category_id,
        walletId: tx.account_id,
        type: tx.type,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await TransactionService.deleteTransaction(id, token);
      setTxs(await TransactionService.getTransactions(token));
      toast.success("Transaction deleted");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Manage Transactions
        </h1>

        <Formik
          innerRef={(ref) => (formikRef.current = ref)}
          initialValues={{
            title: "",
            amount: "",
            date: "",
            category_id: "",
            walletId: "",
            type: "",
          }}
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
          }) => (
            <Form className="grid gap-4 mb-10">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Field
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title && touched.title
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                  placeholder="e.g. Grocery shopping"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Field
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  type="text"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amount && touched.amount
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                  placeholder="e.g. 50"
                />
                <ErrorMessage
                  name="amount"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Field
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  type="date"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date && touched.date
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                />
                <ErrorMessage
                  name="date"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Field
                  name="category_id" // Change to category_id
                  as="select"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category_id && touched.category_id
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                >
                  <option value="">-- Select a category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category_id"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Field
                  name="type"
                  as="select"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.type && touched.type
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                >
                  <option value="">-- Select type --</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Field>
                <ErrorMessage
                  name="type"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="" className="block text-sm font-medium mb-1">
                  Wallet
                </label>
                <Field
                  name="walletId"
                  as="select"
                  value={values.walletId}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.walletId && touched.walletId
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                >
                  <option value="">-- Select a Wallet --</option>
                  {wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="walletId"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Frequency
                </label>
                <Field
                  name="frequency"
                  as="select"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.frequency && touched.frequency
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                >
                  <option value="">-- Select frequency --</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Field>
                <ErrorMessage
                  name="frequency"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <Field
                  name="end_date"
                  type="date"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.end_date && touched.end_date
                      ? "border-red-500"
                      : "border-gray-300 focus:ring focus:border-green-400"
                  }`}
                />
                <ErrorMessage
                  name="end_date"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                {editId !== null ? "Update Transaction" : "Add Transaction"}
              </button>
            </Form>
          )}
        </Formik>

        <TransactionsSection
          txs={txs}
          wallets={wallets}
          categories={categories}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      <Toaster />
    </div>
  );
}
