import React, { useState, ChangeEvent, FormEvent } from "react";

interface CheckoutData {
  fullName: string;
  dob: string;
  address: string;
  phone: string;
  paymentMethod: string;
  expiryDate: string;
  cardNumber: string;
  cvv: string;
  nameOnCard: string;
  billingCountry: string;
  zipCode: string;
  routingNumber: string;
  accountNumber: string;
  nameOnAccount: string;
  agreed: boolean;
}

const USAPaymentSection: React.FC = () => {
  const [formData, setFormData] = useState<CheckoutData>({
    fullName: "",
    dob: "",
    address: "",
    phone: "",
    paymentMethod: "Choose payment method",
    expiryDate: "",
    cardNumber: "",
    cvv: "",
    nameOnCard: "",
    billingCountry: "",
    zipCode: "",
    routingNumber: "",
    accountNumber: "",
    nameOnAccount: "",
    agreed: true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Data Collected:", formData);
    alert("Data logged to console!");
  };

  return (
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* --- Section 1: Personal Information --- */}
          <section>
            <h2 className="text-xl font-bold mb-1">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Full legal name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Choose payment method"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Date of birth
                </label>
                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Residential address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your 16 digit card number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Phone number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="text"
                  placeholder="CVV"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
          </section>

          {/* --- Section 2: Direct Debit --- */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Direct Debit information</h2>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-[8px] text-white font-bold italic">
                  VISA
                </div>
                <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-[8px] text-white font-bold">
                  DISCOVER
                </div>
                <div className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center text-[8px] text-white font-bold">
                  AMEX
                </div>
                <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">
                  MASTER
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Choose payment method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                >
                  <option>Choose payment method</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Expiry date
                </label>
                <input
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Card number
                </label>
                <input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your 16 digit card number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Security code
                </label>
                <input
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  type="text"
                  placeholder="CVV"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Name on card
                </label>
                <input
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name as it appears on card"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Billing country
                </label>
                <input
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleChange}
                  type="text"
                  placeholder="E.g United States"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ZIP/Postal code
                </label>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your ZIP or Postal code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
          </section>

          {/* --- Section 3: Bank Account --- */}
          <section>
            <h2 className="text-xl font-bold mb-1.5">
              Bank account information
            </h2>
            <p className="text-gray-500 text-base mb-6">
              This is where we will send any money from customer bookings onto
              your boat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Routing number
                </label>
                <input
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your 16 digit card number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Account number
                </label>
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="CVV"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Name on account
                </label>
                <input
                  name="nameOnAccount"
                  value={formData.nameOnAccount}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name as it appears on card"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
          </section>

          {/* --- Submit Section --- */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3 mb-8">
              <input
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-orange-400 focus:ring-orange-400"
              />
              <p className="text-base text-gray-600 leading-relaxed">
                I agree to the subscription terms and understand that I will be
                charged $65 per month after my free trial unless I cancel.
              </p>
            </div>
            <button
              type="submit"
              className="px-10 py-3 bg-[#FBA360] hover:bg-[#e89250] text-white font-bold rounded-full shadow-lg shadow-orange-100 transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default USAPaymentSection;
