"use client";

import React, { useEffect, useState } from "react";
import {
  useGetRefundSettingsQuery,
  useUpdateRefundSettingsMutation,
  useCreateRefundRuleMutation,
  useUpdateRefundRuleMutation,
  useDeleteRefundRuleMutation,
  useGetManualRefundRequestsQuery,
  useCompleteManualRefundMutation,
  type RefundMode,
} from "@/redux/api/refundApi";
import { toast } from "react-toastify";
import {
  Settings,
  ListOrdered,
  HandCoins,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
} from "lucide-react";

type TabKey = "settings" | "manual";

const emptyRuleForm = {
  label: "",
  minDaysBeforeTrip: "7",
  refundPercentOfDeposit: "100",
  sortOrder: "0",
};

export default function RefundManagementPage() {
  const [tab, setTab] = useState<TabKey>("settings");
  const [ruleForm, setRuleForm] = useState(emptyRuleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [manualFilter, setManualFilter] = useState("PENDING");
  const [completeNote, setCompleteNote] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [refundMode, setRefundMode] = useState<RefundMode>("AUTO_STRIPE");

  const { data, isLoading, refetch } = useGetRefundSettingsQuery(undefined);
  const { data: manualData, isLoading: manualLoading } =
    useGetManualRefundRequestsQuery(
      manualFilter === "ALL" ? undefined : manualFilter,
    );

  const [updateSettings] = useUpdateRefundSettingsMutation();
  const [createRule, { isLoading: creatingRule }] = useCreateRefundRuleMutation();
  const [updateRule, { isLoading: updatingRule }] = useUpdateRefundRuleMutation();
  const [deleteRule] = useDeleteRefundRuleMutation();
  const [completeManual, { isLoading: completing }] =
    useCompleteManualRefundMutation();

  const settings = data?.data?.settings;
  const rules: any[] = data?.data?.rules ?? [];
  const manualRequests: any[] = manualData?.data ?? [];

  useEffect(() => {
    if (settings?.customerRefundMode) {
      setRefundMode(settings.customerRefundMode);
    }
  }, [settings?.customerRefundMode]);

  const handleRefundModeChange = (mode: RefundMode) => {
    if (mode === refundMode) return;
    const previous = refundMode;
    setRefundMode(mode);
    updateSettings({ customerRefundMode: mode })
      .unwrap()
      .catch(() => {
        setRefundMode(previous);
        toast.error("Failed to save refund mode. Please try again.");
      });
  };

  const submitRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      label: ruleForm.label.trim(),
      minDaysBeforeTrip: parseFloat(ruleForm.minDaysBeforeTrip),
      refundPercentOfDeposit: parseFloat(ruleForm.refundPercentOfDeposit),
      sortOrder: parseInt(ruleForm.sortOrder, 10) || 0,
      isActive: true,
    };
    try {
      const res: any = editingId
        ? await updateRule({ id: editingId, ...body })
        : await createRule(body);
      if (res?.data?.success) {
        toast.success(editingId ? "Rule updated" : "Rule created");
        setRuleForm(emptyRuleForm);
        setEditingId(null);
        refetch();
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to save rule");
      }
    } catch {
      toast.error("Failed to save rule");
    }
  };

  const startEdit = (rule: any) => {
    setEditingId(rule.id);
    setRuleForm({
      label: rule.label,
      minDaysBeforeTrip: String(rule.minDaysBeforeTrip),
      refundPercentOfDeposit: String(rule.refundPercentOfDeposit),
      sortOrder: String(rule.sortOrder ?? 0),
    });
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Delete this refund rule?")) return;
    try {
      const res: any = await deleteRule(id);
      if (res?.data?.success) {
        toast.success("Rule deleted");
        refetch();
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete rule");
    }
  };

  const handleCompleteManual = async (id: string) => {
    try {
      const res: any = await completeManual({
        id,
        adminNote: completeNote.trim() || undefined,
      });
      if (res?.data?.success) {
        toast.success("Refund marked complete — customer emailed");
        setCompletingId(null);
        setCompleteNote("");
      } else {
        toast.error(res?.error?.data?.message ?? "Failed to complete");
      }
    } catch {
      toast.error("Failed to complete refund");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#035292] p-6 md:p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">Refund management</h1>
        <p className="text-blue-100 mt-1">
          Configure cancellation refund rules and process manual refunds
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === "settings"
              ? "border-[#035292] text-[#035292]"
              : "border-transparent text-gray-500"
          }`}
        >
          <Settings className="w-4 h-4" />
          Rules &amp; settings
        </button>
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === "manual"
              ? "border-[#035292] text-[#035292]"
              : "border-transparent text-gray-500"
          }`}
        >
          <HandCoins className="w-4 h-4" />
          Manual refunds
          {manualRequests.filter((r) => r.status === "PENDING").length > 0 && (
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {manualRequests.filter((r) => r.status === "PENDING").length}
            </span>
          )}
        </button>
      </div>

      {tab === "settings" && (
        <div className="space-y-6">
          {isLoading ? (
            <p className="text-gray-500">Loading…</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Processing mode
                </h2>
                <p className="text-sm text-gray-600">
                  Applies to all cancellations (customer, captain, or weather).
                  <b> Auto:</b> Stripe refund when a booking is cancelled.{" "}
                  <b>Manual:</b> queue for admin — refund in Stripe, then mark
                  complete under Manual refunds.
                </p>
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-gray-700">
                    Customer cancellation refunds
                  </legend>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerRefundMode"
                        value="AUTO_STRIPE"
                        checked={refundMode === "AUTO_STRIPE"}
                        onChange={() => handleRefundModeChange("AUTO_STRIPE")}
                        className="w-4 h-4 text-[#035292]"
                      />
                      <span className="text-sm text-gray-800">
                        Automatic (Stripe)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerRefundMode"
                        value="MANUAL"
                        checked={refundMode === "MANUAL"}
                        onChange={() => handleRefundModeChange("MANUAL")}
                        className="w-4 h-4 text-[#035292]"
                      />
                      <span className="text-sm text-gray-800">
                        Manual (admin queue)
                      </span>
                    </label>
                  </div>
                </fieldset>
                <p className="text-xs text-gray-500">
                  Captain or weather cancellations always refund 100% of the
                  deposit to the customer; only the processing mode above
                  applies.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <ListOrdered className="w-5 h-5" />
                  Refund rules
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Rules match when <b>days before trip ≥ min days</b>. The rule with
                  the <b>highest</b> min days wins (e.g. 7 days → 100%, 5 days → 20%).
                </p>

                <form
                  onSubmit={submitRule}
                  className="grid md:grid-cols-5 gap-3 mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <input
                    placeholder="Label (e.g. 7 days full)"
                    className="md:col-span-2 border rounded-lg px-3 py-2 text-sm"
                    value={ruleForm.label}
                    onChange={(e) =>
                      setRuleForm({ ...ruleForm, label: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="Min days before trip"
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={ruleForm.minDaysBeforeTrip}
                    onChange={(e) =>
                      setRuleForm({
                        ...ruleForm,
                        minDaysBeforeTrip: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="% of deposit"
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={ruleForm.refundPercentOfDeposit}
                    onChange={(e) =>
                      setRuleForm({
                        ...ruleForm,
                        refundPercentOfDeposit: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="submit"
                    disabled={creatingRule || updatingRule}
                    className="flex items-center justify-center gap-1 bg-[#ffaa33] text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {editingId ? "Update rule" : "Add rule"}
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Label</th>
                        <th className="py-2 pr-4">Min days</th>
                        <th className="py-2 pr-4">Refund %</th>
                        <th className="py-2 pr-4">Active</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map((rule) => (
                        <tr key={rule.id} className="border-b border-gray-100">
                          <td className="py-3 pr-4 font-medium">{rule.label}</td>
                          <td className="py-3 pr-4">{rule.minDaysBeforeTrip}</td>
                          <td className="py-3 pr-4">
                            {rule.refundPercentOfDeposit}%
                          </td>
                          <td className="py-3 pr-4">
                            <button
                              type="button"
                              className={`text-xs px-2 py-1 rounded ${
                                rule.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                              onClick={() =>
                                updateRule({
                                  id: rule.id,
                                  isActive: !rule.isActive,
                                })
                              }
                            >
                              {rule.isActive ? "Active" : "Off"}
                            </button>
                          </td>
                          <td className="py-3 flex gap-2">
                            <button
                              type="button"
                              className="text-blue-600 hover:underline text-xs"
                              onClick={() => startEdit(rule)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-red-600 hover:underline text-xs flex items-center gap-1"
                              onClick={() => handleDeleteRule(rule.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rules.length === 0 && (
                    <p className="text-gray-500 py-4">No rules yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "manual" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {["PENDING", "COMPLETED", "ALL"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setManualFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  manualFilter === s
                    ? "bg-[#035292] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {manualLoading ? (
            <p className="text-gray-500">Loading manual refunds…</p>
          ) : manualRequests.length === 0 ? (
            <p className="text-gray-500 bg-white rounded-xl border p-8 text-center">
              No manual refund requests in this filter.
            </p>
          ) : (
            <div className="space-y-4">
              {manualRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {req.booking?.trip?.tripName ?? "Trip"} —{" "}
                        {req.refundAmount != null
                          ? `$${req.refundAmount.toFixed(2)}`
                          : ""}{" "}
                        refund
                      </p>
                      <p className="text-sm text-gray-500">
                        {req.ruleLabel ?? "Policy"} · Cancelled by{" "}
                        {req.cancelledBy ?? "—"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {req.status === "PENDING" ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {req.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>
                      <p className="font-medium text-gray-900">Customer</p>
                      <p>{req.customerName || "—"}</p>
                      <p>{req.customerEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Stripe customer: {req.stripeCustomerId || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Captain</p>
                      <p>{req.captainName || "—"}</p>
                      <p>{req.captainEmail || "—"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Connect account:{" "}
                        {req.booking?.boat?.captain?.accountId || "—"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="font-medium text-gray-900">Stripe</p>
                      <p className="font-mono text-xs break-all">
                        PaymentIntent: {req.stripePaymentIntentId || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Booking ID: {req.bookingId}
                      </p>
                      <p className="text-xs">
                        Eligible: {req.refundPercentApplied ?? "—"}% of deposit
                      </p>
                    </div>
                  </div>

                  {req.status === "PENDING" && (
                    <div className="pt-2 border-t">
                      {completingId === req.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            rows={2}
                            placeholder="Note to customer (optional)"
                            value={completeNote}
                            onChange={(e) => setCompleteNote(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={completing}
                              onClick={() => handleCompleteManual(req.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                              {completing
                                ? "Saving…"
                                : "Mark refund complete & email customer"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCompletingId(null);
                                setCompleteNote("");
                              }}
                              className="text-gray-600 text-sm px-3"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCompletingId(req.id)}
                          className="bg-[#035292] text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Process refund in Stripe, then mark complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
