import React from "react";

// react icons
import { RxCross1 } from "react-icons/rx";
import Link from "next/link";

import Login from "./Login";

interface LoginModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`${
        isOpen ? " visible" : " invisible"
      } w-full h-screen fixed top-0 left-0 z-[200000000] dark:bg-black/40 bg-[#0000002a] transition-all duration-300 flex items-center justify-center`}
    >
      <div
        className={`${
          isOpen ? " scale-[1] opacity-100" : " scale-[0] opacity-0"
        } w-[90%] sm:w-[80%] md:w-[35%] dark:bg-slate-800 bg-[#fff] rounded-lg transition-all duration-300 mx-auto mt-8`}
      >
        <div className="w-full flex items-end p-4 justify-between border-b dark:border-slate-700 border-[#d1d1d1]">
          <h1 className="text-[1.5rem] dark:text-[#abc2d3] font-bold">
            Sign in to our platform
          </h1>
          <RxCross1
            className="p-2 text-[2.5rem] dark:text-[#abc2d3]/70 dark:hover:bg-slate-900/50 hover:bg-[#e7e7e7] rounded-full transition-all duration-300 cursor-pointer"
            onClick={() => onClose(false)}
          />
        </div>

        <Login />

        <div className="flex items-center justify-center w-full pb-4 mt-5">
          <p className="text-[1rem] font-[400] dark:text-[#abc2d3] text-[#464646c]">
            Not have any account?{" "}
            <Link href="/signup" className="text-[#3B9DF8] underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
