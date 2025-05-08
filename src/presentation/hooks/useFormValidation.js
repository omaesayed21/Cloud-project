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

export const transactionSchema = yup.object({
  title: yup.string().required("Title is required"),
  amount: yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  date: yup.date().required("Date is required"),
  category_id: yup.number().required("Category is required"),
  walletId: yup.number().required("Wallet is required"),
  type: yup.string()
    .required("Type is required")
    .oneOf(["income", "expense"], "Invalid type"),
  frequency: yup.string()
    .nullable()
    .oneOf(["weekly", "monthly", ""], "Invalid frequency"),
  end_date: yup.date()
    .nullable()
    .when("frequency", {
      is: (val) => val && val !== "",
      then: yup.date()
        .required("End date is required for recurring transactions")
        .min(yup.ref("date"), "End date must be after start date"),
    }),
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
});
