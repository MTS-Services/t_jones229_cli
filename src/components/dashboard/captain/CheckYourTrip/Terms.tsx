import PaymentDetails from "@/components/Payment/PaymentDetails";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Terms() {
  const [agreed, setAgreed] = useState(true);
  return (
    <>
      {/* Header */}
      <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14  py-9">
        <h1 className="text-3xl font-bold text-textPrimary leading-normal mb-2">
          Trips
        </h1>
        <p className="text-base text-textPrimary font-normal leading-normal">
          Here you can list variations to your trips
        </p>
      </div>
      <div className="px-5 md:px-14">
        {/* Card */}
        <div className="flex flex-col lg:flex-row gap-12  bg-white text-gray-800 mt-16">
          <div className="w-full lg:max-w-sm bg-white rounded-xl shadow-md  p-6">
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Membership
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 leading-8">
              Fishing Tripper Membership
            </h2>
            <p className="text-sm text-gray-500 mt-1 leading-5">
              Free 6 month trial then $65 per month.
            </p>

            <div className="mt-6 mb-4">
              <p className="text-4xl font-bold text-gray-900 leading-[52px]">
                $65
              </p>
              <span className="text-sm text-gray-500">/mo</span>
            </div>

            <hr className="my-4 border-gray-200" />

            <p className="text-xs font-semibold text-gray-700 uppercase mb-4 tracking-wider">
              Whats Included...
            </p>
            <ul className="space-y-3 text-sm text-gray-800">
              {[
                "6-Month Free Trial",
                "Flat $65/month after the free trial",
                "Unlimited Trip Listings",
                "Cancel Anytime",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 leading-5">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Terms & Conditions Summary
            </h2>
            <ul className="space-y-2 text-textPrimary text-base leading-7 list-disc list-inside">
              <li>You will not be charged for the first 6 months.</li>
              <li>
                After the free trial, $65/month will be charged automatically.
              </li>
              <li>
                You can cancel anytime before the next billing cycle to avoid
                charges.
              </li>
              <li>
                If you cancel, your listings will be removed from the platform.
              </li>
              <li>
                Payments are processed securely via Stripe (or relevant payment
                provider).
              </li>
            </ul>
          </div>
        </div>

        {/* payment  */}
        <div className="max-w-4xl py-16">
          {/* <PaymentDetails /> */}

          {/* i agree  */}
          <div className="flex items-start gap-3 mt-6">
            <input
              id="subscription-agreement"
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="subscription-agreement"
              className="text-sm text-gray-800 leading-7"
            >
              I agree to the subscription terms and understand that I will{" "}
              <br /> be charged <strong>$65 per month</strong> after my free
              trial unless I cancel.
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
