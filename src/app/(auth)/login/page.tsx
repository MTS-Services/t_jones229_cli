import logo2 from "@/assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import Login from "@/components/Auth/Login";

export default function Page() {
  return (
    <div className="w-full min-h-screen relative bg-blue-600">
      <ToastContainer />
      <div className="container mx-auto py-3 md:py-28 flex flex-col justify-center items-center text-white">
        <Link href={"/"}>
          <Image
            src={logo2}
            alt="logo"
            height={100}
            width={100}
            className="h-28 w-52"
          />
        </Link>

        <div className="text-center mx-auto">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold leading-[52px] mb-2 w-full md:w-[450px]">
              Log in to your account
            </h2>
            <p className="text-lg font-normal font-satoshi mb-6">
              Don&apos;t have an account?
              <Link href="/signup" className="text-[#FF9500] cursor-pointer">
                {" "}
                Sign up
              </Link>
            </p>
          </div>

          {/* Login Form */}
          <Login />
        </div>
      </div>
    </div>
  );
}
