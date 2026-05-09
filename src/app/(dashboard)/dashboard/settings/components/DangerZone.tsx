import React, { useState } from "react";
import { AlertTriangle, Trash2, UserX } from "lucide-react";

export default function DangerZone() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeactivateAccount = () => {
    console.log("Deactivating account...");
    // Implementation would go here
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
    // Implementation would go here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
      <h2 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Danger Zone
      </h2>

      <div className="space-y-4">
        {/* Deactivate Account */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3 flex-1">
            <UserX className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Deactivate Account</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>
          </div>
          <button
            onClick={handleDeactivateAccount}
            className="ml-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Deactivate
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start gap-3 flex-1">
            <Trash2 className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500">
                  This action is permanent
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete your account? All your
              data will be permanently removed and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
