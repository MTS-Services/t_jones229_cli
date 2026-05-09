import React from "react";
import { Ship, Edit, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

export default function QuickActions() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const actions = [
    {
      icon: Shield,
      label: "Security",
      description: "Password",
      bgColor: "bg-purple-100",
      hoverBg: "hover:bg-purple-50",
      hoverBorder: "hover:border-purple-300",
      iconColor: "text-purple-600",
      onClick: () => router.push("/dashboard/reset-password"),
    },
    {
      icon: LogOut,
      label: "Logout",
      description: "Sign out",
      bgColor: "bg-red-100",
      hoverBg: "hover:bg-red-50",
      hoverBorder: "hover:border-red-300",
      iconColor: "text-red-600",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center gap-3 p-4 border border-gray-200 rounded-lg ${action.hoverBorder} ${action.hoverBg} transition-colors group`}
            >
              <div
                className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:bg-opacity-80 transition-colors`}
              >
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{action.label}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
