"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  useApproveReqMutation,
  useDeleteUserMutation,
  useSingleUserQuery,
} from "@/redux/api/authApi";
import ApprovePageButton from "../button/ApprovePageButton";
import Image from "next/image";
import DeleteUserModal from "../../modal/DeleteUserModal";
import { toast } from "react-toastify";
import TitleSection from "@/components/dashboard/captain/TiltleSection";


export default function CaptainApproval() {
  const router = useRouter();
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [approvalStatus, setApprovalStatus] = useState<string | undefined>(
    undefined
  );
  const params = useParams();
  const userId = params?.id;

  const { data, isLoading, error } = useSingleUserQuery(userId);
  const [approve, { isLoading: isApproving }] = useApproveReqMutation();
  const [DeleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if (data?.data?.boat[0]?.approvalStatus) {
      setApprovalStatus(data.data.boat[0].approvalStatus);
    }
  }, [data]);

  if (isLoading) {
    return <p className="p-4">Loading captain details...</p>;
  }

  if (error || !data?.data) {
    return <p className="p-4 text-red-500">Failed to load captain data.</p>;
  }

  const user = data.data.user;
  const boat = data.data.boat[0];

  const sections = [
    { id: "basic", title: "Basic Information" },
    { id: "photos", title: "Photos / Video" },
    { id: "fishing", title: "Fishing" },
    { id: "meeting", title: "Meeting Point" },
  ];

  const handleApprove = async () => {
    try {
      await approve({ id: boat?.id, status: "APPROVE" }).unwrap();
      window.location.reload();
    } catch (err) {
      console.error("Approval failed", err);
      alert("Approval failed. Please try again.");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await DeleteUser(userId).unwrap();

      if (res?.success) {
        router.back();
        toast.success("User deleted successfully");
      }
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete the user. Please try again.", err);
    }
  };
  return (
    <>
      <DeleteUserModal
        isOpen={isModalOpen}
        id={userId as string}
        onClose={closeModal}
      />
       <TitleSection />
      <div className="p-4 md:p-8">
        <div className="w-full z-20 p-6 bg-white border border-gray-100 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Captain {user?.firstName || ""} {user?.lastName || ""}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                {user?.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {user.phoneNumber}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {user?.email}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                approvalStatus === "APPROVE"
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {approvalStatus === "APPROVE" ? "Approved" : "Pending approval"}
            </span>
          </div>
          {/* Sections */}
          <div className="space-y-3 mb-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-50 rounded-lg shadow-sm border"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-800 font-medium">
                    {section.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">See more info</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedSections[section.id] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedSections[section.id] && (
                  <div className="px-4 pb-4 text-sm text-gray-700 border-t border-gray-100">
                    <div className="pt-3 space-y-2">
                      {section.id === "basic" && (
                        <>
                          <p>
                            <strong>Listing Type:</strong>{" "}
                            {boat?.listingType || "N/A"}
                          </p>
                          <p>
                            <strong>Guest Capacity:</strong>{" "}
                            {boat?.guests || "N/A"}
                          </p>
                          <p>
                            <strong>Boat Type:</strong>{" "}
                            {boat?.boatType || "N/A"}
                          </p>
                          <p>
                            <strong>Manufacturer:</strong>{" "}
                            {boat?.manufacturer || "N/A"}
                          </p>
                          <p>
                            <strong>Model Year:</strong>{" "}
                            {boat?.modelYear || "N/A"}
                          </p>
                        </>
                      )}
                      {section.id === "photos" && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {boat?.photos?.map(
                              (photo: { id: string; url: string }) => (
                                <Image
                                  key={photo.id}
                                  src={photo.url}
                                  alt="Boat"
                                  className="rounded-md object-cover h-32 w-full"
                                  height={200}
                                  width={200}
                                />
                              )
                            )}
                          </div>
                          {boat?.videos?.map(
                            (video: { id: string; url: string }) => (
                              <video
                                key={video.id}
                                controls
                                className="rounded-md w-full h-[300px] mt-2"
                              >
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )
                          )}
                        </>
                      )}
                      {section.id === "fishing" && (
                        <>
                          <p>
                            <strong>Facilities:</strong>{" "}
                            {boat?.facilities?.join(", ") || "N/A"}
                          </p>
                          <p>
                            <strong>Gear and Crew:</strong>{" "}
                            {boat?.gearAndCrew?.join(", ") || "N/A"}
                          </p>
                          <p>
                            <strong>Species:</strong>{" "}
                            {boat?.fishing?.[0]?.species?.join(", ") || "N/A"}
                          </p>
                          <p>
                            <strong>Fishing Locations:</strong>{" "}
                            {boat?.fishing?.[0]?.fishingLocation?.join(", ") ||
                              "N/A"}
                          </p>
                          <p>
                            <strong>Techniques:</strong>{" "}
                            {boat?.fishing?.[0]?.fishingTechnique?.join(", ") ||
                              "N/A"}
                          </p>
                          <p>
                            <strong>Policies:</strong>{" "}
                            {boat?.fishing?.[0]?.policies?.join("; ") || "N/A"}
                          </p>
                          <p>
                            <strong>Included in Price:</strong>{" "}
                            {boat?.fishing?.[0]?.includedPrice?.join(", ") ||
                              "N/A"}
                          </p>
                        </>
                      )}
                      {section.id === "meeting" && (
                        <>
                          {boat?.meetingPoint?.map(
                            (point: {
                              id: string;
                              street: string;
                              city: string;
                              country: string;
                              postCode: string;
                              direction: string;
                            }) => (
                              <div key={point.id}>
                                <p>
                                  <strong>Address:</strong> {point.street},{" "}
                                  {point.city}, {point.country},{" "}
                                  {point.postCode}
                                </p>
                                <p>
                                  <strong>Direction:</strong> {point.direction}
                                </p>
                              </div>
                            )
                          ) || <p>No meeting point info available</p>}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {approvalStatus !== "APPROVE" && (
            <div className="block">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                >
                  Decline Captain
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={approvalStatus === "APPROVE" || isApproving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                  {approvalStatus === "APPROVE"
                    ? "Captain Approved"
                    : isApproving
                    ? "Approving..."
                    : "Approve Captain"}
                </Button>
              </div>
            </div>
          )}
          {approvalStatus === "APPROVE" && (
            <div className="flex justify-center items-center py-8 gap-4">
              <div>
                <ApprovePageButton
                  onClick={() => setShowRequestInfoModal(true)}
                >
                  Request More Information
                </ApprovePageButton>
              </div>
              <div>
                <ApprovePageButton onClick={openModal}>
                  Delete Account
                </ApprovePageButton>
              </div>
              <div>
                <ApprovePageButton
                  onClick={() => setShowResetPasswordModal(true)}
                >
                  Reset Password
                </ApprovePageButton>
              </div>
            </div>
          )}
        </div>

        {/* Request Info Modal */}
        {showRequestInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Request more information
              </h3>
              <p className="mb-4">
                To request more information, send an email to the captain.
              </p>
              <p className="mb-4">
                Remember to include specific information of what you need from
                them.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRequestInfoModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Implement email sending logic here
                    setShowRequestInfoModal(false);
                  }}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Delete account</h3>
              <p className="mb-4">Are you sure you want to delete account?</p>
              <p className="mb-4">
                This will permanently delete the account and they&apos;ll have
                to sign back up.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteModal(false)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // Implement account deletion logic here
                    handleConfirmCancel();
                    setDeleteModal(false);
                  }}
                >
                  {deleteLoading ? "Deleting..." : " Confirm and delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
              <p className="mb-4">
                Confirm below to send an email to the captain&apos;s email to
                reset password.
              </p>
              <p className="mb-4">
                Make sure their email on the platform is correct with them.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResetPasswordModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Implement password reset logic here
                    setShowResetPasswordModal(false);
                  }}
                >
                  Send a reset password email
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
