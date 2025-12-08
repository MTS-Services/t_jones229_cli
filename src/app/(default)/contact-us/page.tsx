"use client";
import Button from "@/components/ReUsible/Button";
import FloatingInput from "@/components/ReUsible/InputField";
import { useSupportMutation } from "@/redux/api/authApi";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
  email: string;
  name: string;
  description: string;
};
export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [support] = useSupportMutation();
  const onSubmit = async (data: any) => {
    try {
      const response = await support(data);

      if ("data" in response && response.data) {
        toast(response.data.message || "Support request sent successfully!");
        reset();
      } else if ("error" in response && response.error) {
        toast.error("Failed to send support request.");
      }
    } catch (error) {
      console.error("Error sending support data:", error);
      // Optionally handle error (e.g., show error message)
    }
  };

  return (
    <div className="">
      <div className="bg-[#F5F5F5]">
        <h1 className="container mx-auto text-xl md:text-2xl text-[#242424] font-bold leading-9 py-10 px-5 lg:px-0">
          Contact us
        </h1>
      </div>

      <div className="container mx-auto mt-10 md:mt-24 px-5 lg:px-0">
        <h1 className="text-2xl md:text-[40px] text-[#242424] font-bold">
          Get In Touch
        </h1>
        <h1 className="text-xl font-medium text-[#152536] my-7">
          Leave us a message
        </h1>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-5 lg:px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FloatingInput
            label="name"
            id="name"
            register={register("name", {
              required: "Name is required",
            })}
            error={errors.name}
          />
          <FloatingInput
            label="email"
            id="email"
            register={register("email", {
              required: "email is required",
            })}
            error={errors.email}
          />

          <FloatingInput
            label="Description"
            id="description"
            type="textarea"
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
          />

          <Button className="mt-3 md:mt-10" variant="secondary" type="submit">
            Send Message
          </Button>
        </form>

        <div className="text-gray-700 text-sm">
          <p className="mb-4">Fishing Tripper Admin </p>

          <p className="text-blue-600 hover:underline cursor-pointer">
            tom@fishingtripper.com
          </p>
        </div>
      </div>
    </div>
  );
}
