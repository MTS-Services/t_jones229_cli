import React, { useState } from "react";
import { Flex, Modal } from "antd";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSentMessageCaptainMutation } from "@/redux/api/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";

type EmailModalProps = {
  reciverId: string; // or `any` if you're unsure, but prefer typing it
};
const EmailModal: React.FC<EmailModalProps> = ({ reciverId }) => {
  const [openResponsive, setOpenResponsive] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isMessageFocused, setIsMessageFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [sendMessages, { isLoading }] = useSentMessageCaptainMutation();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  // Watch input values
  const nameValue = watch("name");
  const emailValue = watch("email");
  const messageValue = watch("message");

  const handleSend = async (data: any) => {
    // Send data to backend or API if needed
    const res = await sendMessages({ data, id: reciverId });
    if (res?.data?.success) {
      toast.success(res?.data?.message || "Message send successfully!");
    }
    setOpenResponsive(false);
    reset();
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      {/* Open Modal Button */}
      <button
        onClick={() => setOpenResponsive(true)}
        className="cursor-pointer hover:underline hover:text-blue-500"
      >
        {userRole === "CAPTAIN" ? "Email the customer" : "Email the captain"}
      </button>

      {/* Modal */}
      <Modal
        centered
        open={openResponsive}
        onCancel={() => setOpenResponsive(false)}
        footer={null}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "60%",
          xxl: "40%",
        }}
      >
        <div className="mx-auto bg-white rounded-lg p-6">
          {/* Mail Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-textPrimary mb-6">
            Send a message to the captain
          </h2>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(handleSend)}>
            {/* Name Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="name"
                  className={`absolute text-base left-3 px-1 transition-all  font-medium ${
                    isNameFocused || nameValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="email"
                  className={`absolute text-base left-3 px-1 transition-all  font-medium ${
                    isEmailFocused || emailValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="message"
                  className={`absolute text-base left-3 px-1 transition-all font-medium ${
                    isMessageFocused || messageValue
                      ? "-top-3 text-blue-500 bg-white px-3"
                      : "top-3 text-gray-400"
                  }`}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required",
                  })}
                  rows={5}
                  onFocus={() => setIsMessageFocused(true)}
                  onBlur={() => setIsMessageFocused(false)}
                  className="w-full border-2 bg-white border-gray-300 rounded-md px-3 pt-4 pb-2 outline-none"
                  placeholder=" "
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.message.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className="w-full bg-[#ffaa33] hover:bg-orange-600 text-white font-medium py-3 rounded-lg"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            Cancelling this trip will free up your reserved spot(s). We won’t
            charge you anymore for this cancellation.
          </p>
        </div>
      </Modal>
    </Flex>
  );
};

export default EmailModal;
