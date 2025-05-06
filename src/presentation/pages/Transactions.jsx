import { useEffect, useRef, useState } from "react";
import { TransactionService } from "../../infrastructure/services/TransactionService";
import { transactionSchema } from "../hooks/useFormValidation";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { getWallets } from "../../infrastructure/services/WalletService";

export default function Transactions() {
  const formikRef = useRef(null);
  const [wallets, setWallets] = useState([]);
  const [txs, setTxs] = useState([]);
  const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other"];
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setTxs(TransactionService.getTransactions());
    setWallets(getWallets());
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const tx = {
      title: values.title,
      amount: parseFloat(values.amount),
      date: values.date,
      category: values.category,
      walletId: values.walletId,
    };

    try {
      if (editId !== null) {
        TransactionService.updateTransaction(editId, tx);
        toast.success("Transaction updated");
      } else {
        TransactionService.addTransaction(tx);
        toast.success("Transaction added");
      }
     
      setTxs(TransactionService.getTransactions());
      setSubmitting(false);
      setEditId(null); 
      formikRef.current?.resetForm();

    } catch (err) {
      setErrors({ general: "An error occurred while saving the transaction." });
      toast.error("Transaction failed");
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    setEditId(tx.id);
    if (formikRef.current) {
      formikRef.current.setValues({
        title: tx.title,
        amount: tx.amount,
        date: tx.date,
        category: tx.category,
        walletId: tx.walletId || "",
      });
    }
  };
  

  const handleDelete = (id) => {
    TransactionService.deleteTransaction(id);
    setTxs(TransactionService.getTransactions());
    toast.success("Transaction deleted");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Transactions</h1>

        <Formik   innerRef={(ref) => formikRef.current = ref}

          initialValues={{
            title: "",
            amount: "",
            date: "",
            category: "",
            walletId: "",
          }}
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => (
            <Form className="grid gap-4 mb-10">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Field
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title && touched.title ? 'border-red-500' : 'border-gray-300 focus:ring focus:border-green-400'}`}
                  placeholder="e.g. Grocery shopping"
                />
                <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Field
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  type="text"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300 focus:ring focus:border-green-400'}`}
                  placeholder="e.g. 50"
                />
                <ErrorMessage name="amount" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Field
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  type="date"
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date && touched.date ? 'border-red-500' : 'border-gray-300 focus:ring focus:border-green-400'}`}
                />
                <ErrorMessage name="date" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Field
                  name="category"
                  as="select"
                  value={values.category}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category && touched.category ? 'border-red-500' : 'border-gray-300 focus:ring focus:border-green-400'}`}
                >
                  <option value="">-- Select a category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="p" className="text-red-500 text-sm mt-1" />
              </div>
                    <div>
                      <label htmlFor=""  className="block text-sm font-medium mb-1"> Wallet</label>
                      <Field
                        name="walletId"
                        as="select"
                        value={values.walletId}
                        onChange={handleChange}
                        className={` w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500  ${errors.walletId && touched.walletId ? 'border-red-500' : 'border-gray-300 focus:ring focus:border-green-400'}`} >

                      <option value="">-- Select a Wallet --</option>
                        {wallets.map((wallet) => (
                          <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                        ))}

                        </Field>
                        <ErrorMessage name="walletId" component="p" className="text-red-500 text-sm mt-1" />

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

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Transactions</h2>

        <div className="space-y-4">
          {txs.map((tx) => (
            <div
              key={tx.id}
              className="p-4 bg-white border-l-4 border-blue-500 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{tx.title}</h3>
                <p className="text-gray-600 text-sm">
                  {tx.category} | {new Date(tx.date).toLocaleDateString()}<br />
                  Wallet: <span className="font-medium">
                    {wallets.find((w) => w.id === tx.walletId)?.name || "N/A"}
                  </span>
                </p>              </div>
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-bold">${tx.amount}</span>
                <button
                  onClick={() => handleEdit(tx)}
                  className="text-blue-500 hover:underline text-sm cursor-pointer flex items-center gap-1"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(tx.id)}
                  className="text-red-500 hover:underline text-sm  cursor-pointer flex items-center gap-1"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
