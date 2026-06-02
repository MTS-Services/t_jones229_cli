import { FaCheckCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // adjust import based on your setup

const RegistrationSuccess = ({ setRegistrationSuccess }) => {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center ">
      <div className="bg-white rounded-2xl shadow border border-green-100 w-full max-w-xl overflow-hidden">
        {/* Success Header Gradient */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>

        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow transform transition-transform hover:scale-105 duration-300">
                <FaCheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Success Message with Enhanced Typography */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome Aboard!
              </h2>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="h-px w-8 bg-green-200"></div>
                <p className="text-lg font-semibold text-green-600">
                  Registration Successful
                </p>
                <div className="h-px w-8 bg-green-200"></div>
              </div>
            </div>
            <Link
              href="/"
              className="mb-8 transform hover:scale-110 transition-all duration-300 ease-in-out"
            >
              <Image
                src={BRAND_LOGO_URL}
                alt="Company Logo"
                height={120}
                width={120}
                unoptimized
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md"
                priority
              />
            </Link>
            {/* Email Verification Message */}
            <div className="bg-green-50 rounded-xl p-5 w-full border border-green-100">
              <p className="text-gray-700 font-medium mb-2">
                📧 Please check your email
              </p>
              <p className="text-sm text-gray-500">
                We've sent a verification link to your registered email address.
                Click the link to activate your account.
              </p>
            </div>

            {/* Action Buttons with Icons */}
            <div className="w-full space-y-4 pt-4">
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 bg-gradient-to-r from-[#105e9e] to-[#0d4a7a] text-white 
                         font-semibold rounded-xl flex items-center justify-center gap-3
                         hover:shadow-md transform transition-all 
                         duration-300 group"
              >
                <FaSignInAlt className="text-lg group-hover:translate-x-1 transition-transform" />
                <span>Go to Login</span>
              </Button>

              <button
                onClick={() => setRegistrationSuccess(false)}
                className="w-full group flex items-center justify-center gap-2 
                         text-gray-500 hover:text-[#105e9e] font-medium py-3 
                         rounded-lg transition-all duration-300"
              >
                <FaUserPlus className="text-lg group-hover:scale-110 transition-transform" />
                <span>Register Another Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
