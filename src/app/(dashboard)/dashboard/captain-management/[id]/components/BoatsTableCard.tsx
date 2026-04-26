import React from "react";
import { Ship, Eye, Fish } from "lucide-react";
import { Boat } from "../types/types";

interface BoatsTableCardProps {
  boats: Boat[];
  onViewBoat: (boat: Boat) => void;
}

const BoatsTableCard: React.FC<BoatsTableCardProps> = ({
  boats,
  onViewBoat,
}) => {
  const getApprovalStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVE":
        return "bg-emerald-50 text-emerald-700";
      case "PENDING":
        return "bg-amber-50 text-amber-700";
      case "DECLINE":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-blue-100 border-b border-gray-100">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Ship className="h-5 w-5 text-blue-600" />
          Boat & Trips Information ({boats?.length || 0})
        </h2>
      </div>
      <div className="">
        {boats && boats.length > 0 ? (
          <>
            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {boats.map((boat) => (
                <div key={boat.id} className="p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {boat.manufacturer || "Unknown Boat"}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span>{boat.boatType || "N/A"}</span>
                      <span>{boat.guests || 0} guests</span>
                      <span>{boat.boatLength || 0} ft</span>
                      <span>{boat.modelYear || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-0.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getApprovalStatusStyle(boat.approvalStatus)}`}
                      >
                        {boat.approvalStatus || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Fish className="w-3 h-3" />
                        {boat.trips?.length || 0} trips
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewBoat(boat)}
                    className="flex-shrink-0 p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      Boat Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Capacity
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Length
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Model Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Trips
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boats.map((boat) => (
                    <tr
                      key={boat.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left">
                        {boat.manufacturer || "Unknown Boat"}
                      </td>
                      <td className="px-6 py-4 text-left">
                        {boat.boatType || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {boat.guests || 0}{" "}
                        {boat.guests === 1 ? "Guest" : "Guests"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {boat.boatLength || 0} ft
                      </td>
                      <td className="px-6 py-4 text-center">
                        {boat.modelYear || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getApprovalStatusStyle(boat.approvalStatus)}`}
                        >
                          {boat.approvalStatus || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center flex items-center justify-center space-x-1">
                        <Fish className="w-4 h-4 text-gray-400" />
                        <span>{boat.trips?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onViewBoat(boat)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center justify-center"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ship className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-gray-500 font-medium">No boats found</p>
            <p className="text-sm text-gray-400 mt-1">
              This captain hasn&apos;t added any boats yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoatsTableCard;
