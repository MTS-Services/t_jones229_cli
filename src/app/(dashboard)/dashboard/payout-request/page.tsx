"use client";

import React, { useState } from "react";
import {
  useGetBankDetailsQuery,
  useSaveBankDetailsMutation,
  useCreatePayoutRequestMutation,
  useGetCaptainPayoutRequestsQuery,
  useGetEarningsSummaryQuery,
} from "@/redux/api/payoutApi";
import { toast } from "react-toastify";
import { CheckCircle2, Clock, XCircle, Pencil, DollarSign, Building2, TrendingUp, AlertCircle } from "lucide-react";

const ACCOUNT_TYPES = ["Checking", "Savings"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="w-4 h-4" />,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function PayoutRequestPage() {
  const { data: bankData, isLoading: bankLoading } = useGetBankDetailsQuery(undefined);
  const { data: requestsData, isLoading: requestsLoading } = useGetCaptainPayoutRequestsQuery(undefined);
  const { data: earningsData, isLoading: earningsLoading } = useGetEarningsSummaryQuery(undefined);
  const [saveBankDetails, { isLoading: savingBank }] = useSaveBankDetailsMutation();
  const [createPayoutRequest, { isLoading: submitting }] = useCreatePayoutRequestMutation();

  const bankDetails = bankData?.data;
  const hasBankDetails = !!(bankDetails?.bankName && bankDetails?.bankAccountNumber);
  const earnings = earningsData?.data;

  // Bank form state
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankAccountName: "",
    bankRoutingNumber: "",
    bankAccountNumber: "",
    bankAccountType: "Checking",
    bankCountry: "",
    bankCity: "",
  });

  // Payout request form state
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBankEdit = () => {
    if (hasBankDetails) {
      setBankForm({
        bankName: bankDetails.bankName ?? "",
        bankAccountName: bankDetails.bankAccountName ?? "",
        bankRoutingNumber: bankDetails.bankRoutingNumber ?? "",
        bankAccountNumber: bankDetails.bankAccountNumber ?? "",
        bankAccountType: bankDetails.bankAccountType ?? "Checking",
        bankCountry: bankDetails.bankCountry ?? "",
        bankCity: bankDetails.bankCity ?? "",
      });
    }
    setEditingBank(true);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName || !bankForm.bankAccountName || !bankForm.bankRoutingNumber || !bankForm.bankAccountNumber || !bankForm.bankCountry) {
      toast.error("Please fill in all required bank fields");
      return;
    }
    try {
      const res: any = await saveBankDetails(bankForm);
      if (res?.data?.success) {
        toast.success("Bank details saved successfully");
        setEditingBank(false);
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to save bank details");
      }
    } catch {
      toast.error("Failed to save bank details");
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const available = earnings?.available ?? 0;
    if (parsed > available) {
      toast.error(`Amount exceeds your available balance of $${available.toFixed(2)}`);
      return;
    }
    try {
      const res: any = await createPayoutRequest({ amount: parsed, note: note.trim() || undefined });
      if (res?.data?.success) {
        toast.success("Payout request submitted! Admin has been notified.");
        setAmount("");
        setNote("");
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to submit request");
      }
    } catch {
      toast.error("Failed to submit request");
    }
  };

  const requests: any[] = requestsData?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payout Request</h1>
        <p className="text-gray-500 mt-1">Manage your bank details and request payouts from admin.</p>
      </div>

      {/* ── Earnings / Available Balance Banner ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {earningsLoading ? (
          <div className="sm:col-span-3 h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ) : (
          <>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-5 text-white shadow-sm">
              <p className="text-sm font-medium opacity-90">Available to Withdraw</p>
              <p className="text-3xl font-bold mt-1">${(earnings?.available ?? 0).toFixed(2)}</p>
              <p className="text-xs opacity-75 mt-1">Total earned minus approved payouts</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Total Earned
              </div>
              <p className="text-2xl font-bold text-gray-900">${(earnings?.totalEarned ?? 0).toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">
                ${(earnings?.completedEarnings ?? 0).toFixed(2)} completed
                {(earnings?.confirmedEarnings ?? 0) > 0 && (
                  <span className="ml-1 text-yellow-600">
                    + ${(earnings?.confirmedEarnings ?? 0).toFixed(2)} upcoming (est.)
                  </span>
                )}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <AlertCircle className="w-4 h-4" />
                Pending Requests
              </div>
              <p className="text-2xl font-bold text-gray-900">${(earnings?.totalPending ?? 0).toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Awaiting admin approval</p>
            </div>
          </>
        )}
      </div>

      {/* ── Bank Details ─────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Bank Details</h2>
          </div>
          {hasBankDetails && !editingBank && (
            <button
              onClick={handleBankEdit}
              className="flex items-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="p-6">
          {bankLoading ? (
            <p className="text-gray-400 text-sm">Loading bank details…</p>
          ) : hasBankDetails && !editingBank ? (
            // Show saved bank details
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Bank Name", bankDetails.bankName],
                ["Account Holder", bankDetails.bankAccountName],
                ["Routing Number", bankDetails.bankRoutingNumber],
                ["Account Number", `****${bankDetails.bankAccountNumber?.slice(-4)}`],
                ["Account Type", bankDetails.bankAccountType],
                ["Country", bankDetails.bankCountry],
                ...(bankDetails.bankCity ? [["City", bankDetails.bankCity]] : []),
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            // Bank detail form
            <form onSubmit={handleSaveBank} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <input
                    name="bankName"
                    value={bankForm.bankName}
                    onChange={handleBankFormChange}
                    placeholder="e.g. Chase Bank"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                  <input
                    name="bankAccountName"
                    value={bankForm.bankAccountName}
                    onChange={handleBankFormChange}
                    placeholder="Full name on account"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number *</label>
                  <input
                    name="bankRoutingNumber"
                    value={bankForm.bankRoutingNumber}
                    onChange={handleBankFormChange}
                    placeholder="9-digit routing number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input
                    name="bankAccountNumber"
                    value={bankForm.bankAccountNumber}
                    onChange={handleBankFormChange}
                    placeholder="Account number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
                  <select
                    name="bankAccountType"
                    value={bankForm.bankAccountType}
                    onChange={handleBankFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  >
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    name="bankCountry"
                    value={bankForm.bankCountry}
                    onChange={handleBankFormChange}
                    placeholder="e.g. United States"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="bankCity"
                    value={bankForm.bankCity}
                    onChange={handleBankFormChange}
                    placeholder="City (optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingBank}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 py-2 rounded-lg text-sm disabled:opacity-60 transition"
                >
                  {savingBank ? "Saving…" : "Save Bank Details"}
                </button>
                {editingBank && (
                  <button
                    type="button"
                    onClick={() => setEditingBank(false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2 rounded-lg text-sm transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Request Payout ───────────────────────────── */}
      {hasBankDetails && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Request Payout</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  max={earnings?.available ?? undefined}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to request"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                {earnings?.available !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">
                    Available: <span className="font-semibold text-gray-600">${earnings.available.toFixed(2)}</span>
                    {earnings.available > 0 && (
                      <button
                        type="button"
                        onClick={() => setAmount(String(earnings.available))}
                        className="ml-2 text-yellow-600 hover:underline font-medium"
                      >
                        Request all
                      </button>
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any additional info for admin"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg text-sm disabled:opacity-60 transition"
              >
                {submitting ? "Submitting…" : "Submit Payout Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {!hasBankDetails && !bankLoading && (
        <p className="text-sm text-gray-500 italic">
          Save your bank details above to unlock the payout request form.
        </p>
      )}

      {/* ── Request History ──────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Request History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {requestsLoading ? (
            <p className="text-gray-400 text-sm p-6">Loading…</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No payout requests yet.</p>
          ) : (
            requests.map((req) => {
              const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG["PENDING"];
              return (
                <div key={req.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">${req.amount.toFixed(2)}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                    {req.note && <p className="text-sm text-gray-500 mt-1">{req.note}</p>}
                    {req.adminNote && (
                      <p className="text-sm text-gray-600 mt-1 italic">Admin: {req.adminNote}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
