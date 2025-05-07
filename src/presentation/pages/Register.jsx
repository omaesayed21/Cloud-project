import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { registerSchema } from "../hooks/useFormValidation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <Formik
        initialValues={{
          name: "",
          address: "",
          email: "",
          password: "",
          confirm: "",
        }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", {
              name: values.name,
              address: values.address,
              email: values.email,
              password: values.password,
              password_confirmation: values.confirm,
            });

            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message || "Registered successfully", {
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            });

            setTimeout(() => {
              navigate("/login");
            }, 800);
          } catch (err) {
            toast.error("Registration failed: " + err.response?.data?.message || err.message, {
              style: {
                borderRadius: "8px",
                background: "#fff1f2",
                color: "#991b1b",
              },
            });
            setErrors({ email: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Register Now .....</h2>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter your name"
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.name && touched.name ? "border-red-500" : "border-gray-300 focus:ring focus:border-blue-400"
                }`}
              />
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Address</label>
              <Field
                type="text"
                name="address"
                placeholder="Enter your address"
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.address && touched.address ? "border-red-500" : "border-gray-300 focus:ring focus:border-blue-400"
                }`}
              />
              <ErrorMessage name="address" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300 focus:ring focus:border-blue-400"
                }`}
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className={`w-full p-3 border rounded pr-10 focus:outline-none ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-300 focus:ring focus:border-blue-400"
                }`}
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </div>
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Confirm Password</label>
              <Field
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Confirm password"
                className={`w-full p-3 border rounded pr-10 focus:outline-none ${
                  errors.confirm && touched.confirm ? "border-red-500" : "border-gray-300 focus:ring focus:border-blue-400"
                }`}
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </div>
              <ErrorMessage name="confirm" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <span className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Login
              </Link>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white mt-2 py-3 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </div>
  );
}