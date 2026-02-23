"use client";

import Button from "@/components/ReUsible/Button";
import Loader from "@/components/ui/Loader";
import { useLoginMutation, useSignupMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/slices/authSlice";
import { signInWithGoogle } from "@/services/authService";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [loginFn, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-focus on email field when component mounts
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  // --- Helper function: Get path based on role ---
  const getRedirectPath = (role: string) => {
    if (role === "ADMIN" || role === "SUPERADMIN") return "/dashboard";
    if (role === "CAPTAIN") return "/dashboard/check-your-trip";
    if (role === "USER") return "/dashboard/edit-user-details";
    return "/"; // Default
  };

  // --- Role-based toast messages ---
  const getRoleBasedToastMessage = (role: string) => {
    if (role === "ADMIN") return "Admin login successful!";
    if (role === "SUPERADMIN") return "Super Admin login successful!";
    if (role === "CAPTAIN") return "Captain login successful!";
    if (role === "USER") return "User login successful!";
    return "Login successful!"; // Default
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const userInfo = { email: data.email, password: data.password };

      const result = await loginFn(userInfo).unwrap();

      // If we reach here → success
      const userData = result?.data;
      const role = userData?.role;

      Cookies.set("token", userData?.accessToken);
      Cookies.set("currentUserRole", role);

      dispatch(
        setUser({
          user: userData,
          token: userData?.accessToken,
          isAuthenticated: true,
        }),
      );

      toast.success(getRoleBasedToastMessage(role));

      if (redirectUrl) {
        route.push(redirectUrl);
      } else {
        route.push(getRedirectPath(role));
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      // Handle different error types
      if (error?.status === "FETCH_ERROR") {
        errorMessage =
          "⚠️ Cannot connect to server. Please ensure the API is running on http://localhost:3001";
        console.error(
          "🔴 API Connection Error: Make sure your backend API is running!",
        );
        console.error(
          "💡 Run 'cd api && npm run dev' to start the backend server",
        );
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [registerFN] = useSignupMutation();

  const handleLogin = async (providerFunc: any) => {
    try {
      const { user } = await providerFunc();
      const loginInfo = {
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user.email,
        registerType: "GOOGLE",
        password: "",
      };

      const res = await registerFN(loginInfo);
      if (res?.data?.success) {
        const userData = res?.data?.data;
        const role = userData?.role;

        Cookies.set("token", userData?.accessToken);
        Cookies.set("currentUserRole", role);

        dispatch(
          setUser({
            user: userData,
            token: userData?.accessToken,
            isAuthenticated: true,
          }),
        );

        const targetPath = getRedirectPath(role);
        route.push(targetPath);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl p-6 md:p-8 shadow border border-gray-100 transition-all duration-300 hover:shadow-md"
      noValidate
    >
      {/* Email Field */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Please enter a valid email address",
            },
          })}
          placeholder="you@example.com"
          className={`w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email
              ? "border-red-300 bg-red-50 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400 focus:ring-blue-500"
          }`}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-red-600 text-sm font-medium flex items-center space-x-1"
            role="alert"
          >
            <span>⚠️</span>
            <span>{errors.email.message as string}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            placeholder="Enter your password"
            className={`w-full border rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password
                ? "border-red-300 bg-red-50 focus:ring-red-500"
                : "border-gray-300 hover:border-gray-400 focus:ring-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 013.242-2.878m4.242 4.242L19.95 16.95M14.121 14.121a3 3 0 01-4.243-4.243m4.243 4.243L7.05 7.05"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="text-red-600 text-sm font-medium flex items-center space-x-1"
            role="alert"
          >
            <span>⚠️</span>
            <span>{errors.password.message as string}</span>
          </p>
        )}
      </div>

      {/* Remember & Forgot Password */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-3 sm:space-y-0">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
            {...register("remember")}
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            Remember me
          </span>
        </label>
        <Link
          href={"/forgot-password"}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className={`w-full bg-[#255b88] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl ${
          isLoading || isSubmitting
            ? "opacity-70 cursor-not-allowed hover:scale-100 hover:shadow-lg"
            : "hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]"
        }`}
      >
        {isLoading || isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleLogin(signInWithGoogle)}
          disabled={isLoading || isSubmitting}
          className={`w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 font-medium transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200 ${
            isLoading || isSubmitting
              ? "opacity-70 cursor-not-allowed bg-gray-50"
              : "bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400"
          }`}
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </div>
    </form>
  );
}
