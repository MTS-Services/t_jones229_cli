"use client";

import React, { useState } from "react";
import {
  Shield,
  Activity,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  ExternalLink,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useActivateStripeAccountMutation } from "@/redux/api/bookingApi";
import { useUpdateChargeEnabledMutation } from "@/redux/api/userDashboardApi/userBooking";
import { User } from "../types/profile.types";
import { formatDate } from "../utils/formatters";

interface AccountDetailsProps {
  user: User;
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  const [activateStripe, { isLoading: isActivating }] =
    useActivateStripeAccountMutation();
  const [enableCharge, { isLoading: isEnabling }] =
    useUpdateChargeEnabledMutation();
  const [chargeEnabled, setChargeEnabled] = useState(
    user.chargeEnable ?? false,
  );

  const handleStripeOnboard = async () => {
    try {
      const res = await activateStripe().unwrap();
      if (res?.data) {
        window.open(res.data, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Could not retrieve onboarding link.");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Failed to get Stripe onboarding link.",
      );
    }
  };

  const handleEnableCharges = async () => {
    if (!user.accountId) {
      toast.warning("No Stripe account connected. Complete onboarding first.");
      return;
    }
    try {
      const res: any = await enableCharge(user.accountId);
      if (res?.data?.success) {
        setChargeEnabled(true);
        toast.success(res.data.message ?? "Charges enabled successfully!");
      } else {
        const msg = res?.error?.data?.message ?? "Failed to enable charges.";
        toast.error(msg);
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to enable charges.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Account Details
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-gray-900 font-medium capitalize">
              {user.status?.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-900 font-medium">{user.role}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="text-gray-900 font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-gray-900 font-medium">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>

        {user.role === "CAPTAIN" && (
          <>
            {/* Stripe Account row */}
            <div className="flex items-start gap-3 py-3 border-t border-gray-100">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Stripe Account</p>
                <div className="flex items-center justify-between gap-3 mt-0.5 flex-wrap">
                  <p className="text-gray-900 font-medium">
                    {user.accountId ? "Connected" : "Not connected"}
                  </p>
                  {!user.accountId && (
                    <button
                      onClick={handleStripeOnboard}
                      disabled={isActivating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#635bff] hover:bg-[#4f46e5] text-white transition-all disabled:opacity-50 shadow-sm whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {isActivating ? "Loading..." : "Setup Stripe Account"}
                    </button>
                  )}
                </div>
                {!user.accountId && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Required to receive payouts
                  </p>
                )}
              </div>
            </div>

            {/* Charges Enabled row */}
            <div className="flex items-start gap-3 py-3 border-t border-gray-100">
              {chargeEnabled ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Charges Enabled</p>
                <div className="flex items-center justify-between gap-3 mt-0.5 flex-wrap">
                  <p
                    className={`font-semibold ${chargeEnabled ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {chargeEnabled ? "Yes — ready to accept payments" : "No"}
                  </p>
                  {!chargeEnabled && (
                    <button
                      onClick={handleEnableCharges}
                      disabled={isEnabling || !user.accountId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50 shadow-sm whitespace-nowrap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {isEnabling ? "Enabling..." : "Enable Charges"}
                    </button>
                  )}
                </div>
                {!chargeEnabled && !user.accountId && (
                  <p className="text-xs text-gray-400 mt-1">
                    Complete Stripe setup first to enable charges.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
