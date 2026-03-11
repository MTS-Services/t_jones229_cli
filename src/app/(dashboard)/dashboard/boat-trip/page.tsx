"use client";
import { useState } from "react";
import {
  Ship,
  Users,
  MapPin,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Fish,
  AlertCircle,
} from "lucide-react";
import { useGetMyBoatQuery, useDeleteBoatMutation } from "@/redux/api/boatApi";
import { toast } from "react-toastify";
import {
  Boat,
  BoatDetailModal,
  DeleteConfirmModal,
  getStatusConfig,
} from "./index";

export default function Page() {
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boatToDelete, setBoatToDelete] = useState<Boat | null>(null);

  const {
    data: boatsData,
    isLoading: loading,
    error: apiError,
  } = useGetMyBoatQuery({});
  const [deleteBoat, { isLoading: isDeleting }] = useDeleteBoatMutation();
  const boats = boatsData?.data || [];
  const error = apiError ? "Error loading boats" : null;

  const handleViewBoat = (boat: Boat) => {
    setSelectedBoat(boat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBoat(null);
  };

  const handleDeleteBoat = async (boat: Boat) => {
    setBoatToDelete(boat);
  };

  const confirmDeleteBoat = async () => {
    if (!boatToDelete) return;
    try {
      await deleteBoat({ id: boatToDelete.id }).unwrap();
      toast.success(`"${boatToDelete.manufacturer}" deleted successfully`);
    } catch {
      toast.error("Failed to delete boat");
    } finally {
      setBoatToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-500">Loading your boats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Data</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Ship className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Boat & Trips</h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                Manage your boats and their associated trips
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <PlusCircle className="w-5 h-5" />
            <span>Add New Boat</span>
          </button>
        </div>
      </div>

      {/* Boats Table */}
      {boats.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Ship className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No boats found
          </h3>
          <p className="text-gray-500 mb-6">
            Start by listing your first boat and share your passion for fishing!
          </p>
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <PlusCircle className="w-5 h-5" />
            <span>List Your Boat</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Boat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    List Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Boat Type
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Captain
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {boats.map((boat) => {
                  const statusConfig = getStatusConfig(boat.approvalStatus);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={boat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Boat Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {boat.photos.length > 0 ? (
                              <img
                                src={boat.photos[0].url}
                                alt={boat.manufacturer}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Ship className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {boat.manufacturer}
                            </div>
                            <div className="text-sm text-gray-500">
                              {boat.modelYear} • {boat.boatLength}ft
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {boat.listingType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {boat.boatType}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            {boat.guests}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <div
                          className={`inline-flex items-center justify-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </td>

                      {/* Trips Count */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Fish className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {boat.trips.length}
                          </span>
                        </div>
                      </td>

                      {/* Captain */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {boat.captain.firstName} {boat.captain.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {boat.captain.phoneNumber}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewBoat(boat)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBoat(boat)}
                            disabled={isDeleting}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Options"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boat Detail Modal */}
      {selectedBoat && (
        <BoatDetailModal
          boat={selectedBoat}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!boatToDelete}
        title="Delete Boat"
        message={`Are you sure you want to delete "${boatToDelete?.manufacturer}"? All associated trips will also be removed. This action cannot be undone.`}
        onConfirm={confirmDeleteBoat}
        onCancel={() => setBoatToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
