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
      <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Ship className="h-5 w-5 text-blue-600" />
          Boat & Trips Information ({boats?.length || 0})
        </h2>
      </div>
      <div className="">
        {boats && boats.length > 0 ? (
          <div className="overflow-x-auto">
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
