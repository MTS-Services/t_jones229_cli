import React, { useEffect, useState } from "react";
import { Flex, Modal } from "antd";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSentMessageCaptainMutation } from "@/redux/api/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";

type EmailFormValues = {
  name: string;
  email: string;
  message: string;
};

type EmailModalProps = {
  reciverId: string;
  recipientName?: string;
  recipientEmail?: string;
};

const EmailModal: React.FC<EmailModalProps> = ({
  reciverId,
  recipientName,
  recipientEmail,
}) => {
  const [openResponsive, setOpenResponsive] = useState(false);
  const [isMessageFocused, setIsMessageFocused] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userRole = currentUser?.role;
  const isCaptain = userRole === "CAPTAIN";

  const displayRecipientName =
    recipientName?.trim() ||
    (isCaptain ? "your customer" : "the captain");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EmailFormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const [sendMessages, { isLoading }] = useSentMessageCaptainMutation();
  const messageValue = watch("message");

  useEffect(() => {
    if (!openResponsive) return;
    reset({ name: "", email: "", message: "" });
  }, [openResponsive, reset]);

  const handleSend = async (data: EmailFormValues) => {
    if (!recipientEmail) {
      toast.error(
        isCaptain
          ? "Customer email is not available for this booking."
          : "Captain email is not available for this booking.",
      );
      return;
    }
    if (!currentUser?.name || !currentUser?.email) {
      toast.error("Your account name and email are required to send a message.");
      return;
    }

    const payload = {
      name: currentUser.name,
      email: currentUser.email,
      message: data.message,
    };

    const res = await sendMessages({ data: payload, id: reciverId });
    if (res?.data?.success) {
      toast.success(res?.data?.message || "Message sent successfully!");
    } else {
      const errMsg =
        (res as { error?: { data?: { message?: string } } })?.error?.data
          ?.message || "Failed to send message";
      toast.error(errMsg);
      return;
    }
    setOpenResponsive(false);
    reset();
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      <button
        onClick={() => setOpenResponsive(true)}
        className="cursor-pointer hover:underline hover:text-blue-500"
      >
        {isCaptain ? "Email the customer" : "Email the captain"}
      </button>

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
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-textPrimary mb-6">
            Send a message to {displayRecipientName}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(handleSend)}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isCaptain ? "Customer name" : "Captain name"}
              </label>
              <input
                type="text"
                readOnly
                value={recipientName || ""}
                className="w-full border-2 bg-gray-50 border-gray-200 rounded-md px-3 py-2.5 text-gray-700 outline-none cursor-default"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {isCaptain ? "Customer email" : "Captain email"}
              </label>
              <input
                type="email"
                readOnly
                value={recipientEmail || ""}
                className="w-full border-2 bg-gray-50 border-gray-200 rounded-md px-3 py-2.5 text-gray-700 outline-none cursor-default"
              />
              {!recipientEmail && (
                <p className="text-amber-600 text-sm">
                  {isCaptain
                    ? "Customer email is not available for this booking."
                    : "Captain email is not available for this booking."}
                </p>
              )}
            </div>

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
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !recipientEmail}
              className="w-full bg-[#ffaa33] hover:bg-orange-600 text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            {isCaptain
              ? "Your message will be emailed to the customer using your captain account details."
              : "Your message will be emailed to the captain with your contact details."}
          </p>
        </div>
      </Modal>
    </Flex>
  );
};

export default EmailModal;
