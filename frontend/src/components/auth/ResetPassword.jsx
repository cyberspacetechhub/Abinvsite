import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../../shared/baseURL";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPassword = () => {
  const post = usePost();
  const url = `${baseURL}user/resetpswd`;
  const navigate = useNavigate(); // Hook for navigation
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await post(url, { ...data, token }); // Send token with the request
      toast.success("Password reset successful! Redirecting...");
      reset();
      setTimeout(() => {
        navigate("/auth/user/login"); // Redirect to home after success
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-300">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white"
              {...register("password", {
                required: "Password is required",
                // minLength: {
                //   value: 8,
                //   message: "Password must be at least 8 characters long",
                // },
                // pattern: {
                //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                //   message:
                //     "Must include at least one uppercase, one lowercase, one number, and one special character",
                // },
              })}
            />
            <button onClick={togglePasswordVisibility} type="button" className="absolute right-2 top-3">
              {
                showPassword ? 
                <span className="text-gray-800 dark:text-white"><Visibility /></span> :
                <span className="text-gray-800 dark:text-white"><VisibilityOff /></span>
              }
            </button>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
