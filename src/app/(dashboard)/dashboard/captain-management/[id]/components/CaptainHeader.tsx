import React from "react";
import { Mail, Shield } from "lucide-react";
import { CaptainUser } from "../types/types";
import { getStatusConfig } from "../utils/utils";
import StatusBadge from "./StatusBadge";

interface CaptainHeaderProps {
  user: CaptainUser;
}

const CaptainHeader: React.FC<CaptainHeaderProps> = ({ user }) => {
  return (
    <div className="bg-blue-400 rounded-xl shadow p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30">
            {user.firstName?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-blue-100 mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge
                status={user.status}
                className="bg-white/20 text-white border-white/30"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                <Shield className="h-3.5 w-3.5" />
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHeader;
