import { useState } from "react";
import { loginSchema } from "../hooks/useFormValidation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios"; 

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            // استبدال apiFetch بـ axios مباشرة
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
              email: values.email,
              password: values.password,
            });

            // تخزين التوكن في localStorage
            localStorage.setItem("token", response.data.token);
            console.log(response.data.token);

            toast.success("Login successful!", {
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            });

            setTimeout(() => {
              navigate("/dashboard");
            }, 800);
          } catch (err) {
            toast.error("Login failed: " + err.response?.data?.message || err.message, {
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
            <h2 className="text-xl font-bold text-gray-700 mb-4">Login Now .....</h2>

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

            <span>
              Don't have an account?{" "}
              <Link to="/Register" className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Sign up
              </Link>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white mt-2 py-3 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      <Toaster />
    </div>
  );
}
