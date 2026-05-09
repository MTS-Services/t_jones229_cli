import logo2 from "@/assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/app/(auth)/login/components/LoginForm";

export default function Page() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="container mx-auto flex flex-col justify-center items-center max-w-md w-full">
        {/* Logo with enhanced styling */}
        <Link
          href={"/"}
          className="mb-4 transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-lg"
        >
          <Image
            src={logo2}
            alt="FishingTripper Logo - Return to homepage"
            height={100}
            width={200}
            className="h-20 w-44 md:h-28 md:w-52 drop-shadow-sm"
            priority
          />
        </Link>

        {/* Header with improved typography */}
        <div className="text-center mb-6 space-y-3">
          <h2 className="text-black text-xl sm:text-2xl md:text-2xl font-bold leading-tight mb-3">
            Log in to your account
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Don&apos;t have an account?
            <Link href="/signup" className="text-[#FF9500] cursor-pointer">
              {" "}
              Sign up
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
