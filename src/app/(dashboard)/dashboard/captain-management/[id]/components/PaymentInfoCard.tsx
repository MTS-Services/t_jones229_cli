import React from "react";
import { CreditCard } from "lucide-react";
import { CaptainUser } from "../types/types";

interface PaymentInfoCardProps {
  user: CaptainUser;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-blue-100 border-b border-gray-100">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Payment Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Customer ID
            </label>
            <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
              {user.customerId}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Account ID
            </label>
            <p className="text-gray-900">{user.accountId || "Not connected"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Payment Method
            </label>
            <p className="text-gray-900">
              {user.paymentMethod
                ? typeof user.paymentMethod === "object"
                  ? user.paymentMethod.paymentMethod || "Card on file"
                  : user.paymentMethod
                : "Not configured"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoCard;
