"use client";

import React, { useState } from "react";
import {
  useGetAllPayoutRequestsQuery,
  useUpdatePayoutRequestStatusMutation,
} from "@/redux/api/payoutApi";
import { CheckCircle2, Clock, XCircle, Building2, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

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

function AdminNoteModal({
  open,
  onClose,
  onConfirm,
  action,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  action: "APPROVED" | "REJECTED" | null;
  loading: boolean;
}) {
  const [note, setNote] = useState("");

  if (!open || !action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {action === "APPROVED" ? "Approve Payout Request" : "Reject Payout Request"}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note for captain (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a message to the captain…"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { onConfirm(note); setNote(""); }}
            disabled={loading}
            className={`flex-1 font-semibold py-2 rounded-lg text-sm text-white disabled:opacity-60 transition ${
              action === "APPROVED"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Saving…" : action === "APPROVED" ? "Confirm Approve" : "Confirm Reject"}
          </button>
          <button
            onClick={() => { onClose(); setNote(""); }}
            className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayoutRequestsPage() {
  const { data, isLoading } = useGetAllPayoutRequestsQuery(undefined);
  const [updateStatus, { isLoading: updating }] = useUpdatePayoutRequestStatusMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const requests: any[] = data?.data ?? [];

  const filtered =
    filterStatus === "ALL"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const openModal = (id: string, action: "APPROVED" | "REJECTED") => {
    setSelectedId(id);
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async (adminNote: string) => {
    if (!selectedId || !selectedAction) return;
    try {
      const res: any = await updateStatus({
        id: selectedId,
        status: selectedAction,
        adminNote: adminNote.trim() || undefined,
      });
      if (res?.data?.success) {
        toast.success(`Request ${selectedAction.toLowerCase()} and captain notified`);
        setModalOpen(false);
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to update");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-500 mt-1">Review and process captain payout requests.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filterStatus === s
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-gray-400 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No requests found.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((req) => {
              const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG["PENDING"];
              const captainName =
                `${req.captain?.firstName ?? ""} ${req.captain?.lastName ?? ""}`.trim() ||
                req.captain?.email;

              return (
                <div key={req.id} className="p-5 space-y-3">
                  {/* Row top */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          ${req.amount.toFixed(2)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        <span className="font-medium text-gray-700">{captainName}</span>{" "}
                        &middot; {req.captain?.email}
                      </p>
                      {req.note && (
                        <p className="text-sm text-gray-500 mt-1">Note: {req.note}</p>
                      )}
                      {req.adminNote && (
                        <p className="text-sm text-gray-600 mt-1 italic">Your note: {req.adminNote}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Approve / Reject buttons */}
                    {req.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(req.id, "APPROVED")}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(req.id, "REJECTED")}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bank details accordion */}
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      View bank details
                    </summary>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 pl-5 pt-1">
                      {[
                        ["Bank", req.captain?.bankName],
                        ["Account Holder", req.captain?.bankAccountName],
                        ["Routing #", req.captain?.bankRoutingNumber],
                        ["Account #", req.captain?.bankAccountNumber],
                        ["Type", req.captain?.bankAccountType],
                        ["Country", req.captain?.bankCountry],
                        ...(req.captain?.bankCity ? [["City", req.captain.bankCity]] : []),
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
                          <p className="text-gray-700 font-medium">{value ?? "—"}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <AdminNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        action={selectedAction}
        loading={updating}
      />
    </div>
  );
}
