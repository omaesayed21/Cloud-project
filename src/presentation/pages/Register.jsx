import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Formik } from "formik";
import { useState } from "react";
import { registerSchema } from "../hooks/useFormValidation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { apiFetch } from "../../infrastructure/services/apifetch";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <Formik
        initialValues={{
          name: "",
          address: "",
          email: "",
          password: "",
          confirm: "",
        }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const data = await apiFetch("http://127.0.0.1:8000/api/register", {
              method: "POST",
              body: JSON.stringify({
                name: values.name,
                address: values.address,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirm,
              }),
            });

            localStorage.setItem("token", data.token);
            toast.success(data.message || "Registered successfully");

            setTimeout(() => {
              navigate("/Login");
            }, 800);
          } catch (err) {
            toast.error(err.message || "Registration failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-700">Register Now ...</h2>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.name && touched.name
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:border-green-400"
                }`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.address && touched.address
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:border-green-400"
                }`}
              />
              {errors.address && touched.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:border-green-400"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded pr-10 focus:outline-none ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:border-green-400"
                }`}
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm text-gray-600">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={values.confirm}
                onChange={handleChange}
                className={`w-full p-3 border rounded pr-10 focus:outline-none ${
                  errors.confirm && touched.confirm
                    ? "border-red-500"
                    : "border-gray-300 focus:ring focus:border-green-400"
                }`}
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </div>
              {errors.confirm && touched.confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
              )}
            </div>

            <span className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600">
                Login
              </Link>
            </span>

            <button
              type="submit"
              className="w-full bg-green-600 text-white mt-2 py-3 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Register
            </button>
          </form>
        )}
      </Formik>
      <Toaster />
    </div>
  );
}
