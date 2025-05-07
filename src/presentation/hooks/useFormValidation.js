import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm: yup
    .string()
    .required("Confirmation is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const transactionSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be a positive number")
    .required("Amount is required"),
  date: yup.string().required("Date is required"),
  category: yup.string().required("Please select a category"),
});

export const walletSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  balance: yup
    .number()
    .typeError("Balance must be a number")
    .min(0, "Balance must be a positive number")
    .required("Balance is required"),
  type: yup.string().required("Type is required"),
});

export const budgetSchema = yup.object().shape({
  category: yup.string().required("Category is required"),
  limit: yup
    .number()
    .typeError("Limit must be a number")
    .min(0, "Limit must be a positive number")
    .required("Limit is required"),
})
