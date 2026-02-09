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

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [loginFn, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

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
    try {
      const userInfo = { email: data.email, password: data.password };
      const res = await loginFn(userInfo);

      if (res?.data?.success) {
        const userData = res?.data?.data;
        const role = userData?.role;

        // 1. Set cookies
        Cookies.set("token", userData?.accessToken);
        Cookies.set("currentUserRole", role);

        // 2. Update redux store
        dispatch(
          setUser({
            user: userData,
            token: userData?.accessToken,
            isAuthenticated: true,
          }),
        );

        // Show role-based toast message
        const toastMessage = getRoleBasedToastMessage(role);
        toast.success(toastMessage);

        // 3. Dynamic redirect
        if (redirectUrl) {
          route.push(redirectUrl);
        } else {
          const targetPath = getRedirectPath(role);
          route.push(targetPath);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
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
    <div>
      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:bg-white  md:p-10 border border-[#d4e9fa] rounded-lg"
      >
        <div>
          <label
            htmlFor="email"
            className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            placeholder="Enter your email address"
            className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="text-base text-start font-bold text-white md:text-[#171717] block mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            placeholder="Set your password"
            className="w-full border text-[#9E9E9E] border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 text-left">
              {errors.password.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center py-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 border-gray-400 rounded-sm focus:ring-blue-500 focus:ring-2"
              {...register("remember")}
            />
            <span className="text-white md:text-[#171717] text-base font-normal leading-7">
              Remember me
            </span>
          </label>
          <Link
            href={"/forgot-password"}
            className="text-base text-white md:text-[#3D53F5] font-bold leading-7"
          >
            Forgot your Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isLoading}
          className={`bg-[#70b6f0] text-white text-base rounded-lg w-full text-center  font-medium font-shatosi hover:bg-[#105e9e] transition-colors duration-300 ease-in-out ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Log in"}
        </Button>

        <h1 className="text-base font-normal text-white md:text-[#616161] pt-8 pb-4">
          Or continue with
        </h1>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleLogin(signInWithGoogle)}
            variant="ghost"
            className="flex items-center gap-3"
          >
            <FcGoogle /> <span className="text-white">Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
