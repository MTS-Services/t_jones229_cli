import { userRole } from "@/constant/user.constants";
import type { TSidebarItem } from "@/types/dashboard.types";
import Link from "next/link";
import { RxReset } from "react-icons/rx";

import {
  TbLayoutDashboard,
  TbUsers,
  TbSailboat,
  TbCalendarEvent,
  TbClipboardList,
  TbRoute,
  TbCrown,
  TbLifebuoy,
} from "react-icons/tb";
import { MdChecklistRtl } from "react-icons/md";

export const sidebarItems: TSidebarItem[] = [
  {
    key: "Dashboard",
    icon: <TbLayoutDashboard />,
    label: <Link href="/dashboard">Dashboard</Link>,
    roles: ["SUPERADMIN"],
  },
  {
    key: "Edit your details",
    icon: <TbLayoutDashboard />,
    label: <Link href="/dashboard/edit-user-details">Edit your details</Link>,
    roles: [userRole.user],
  },
  {
    key: "Your Trips",
    icon: <TbLayoutDashboard />,
    label: <Link href="/dashboard/your-trips">Your Trips</Link>,
    roles: [userRole.user],
  },
  {
    key: "User Management",
    icon: <TbUsers />,
    label: <Link href="/dashboard/user-management">User Management</Link>,
    roles: ["SUPERADMIN"],
  },
  {
    key: "Check Your Trip",
    icon: <MdChecklistRtl />,
    label: <Link href="/dashboard/check-your-trip">Check Your Trip</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Boat And Trip",
    icon: <TbSailboat />,
    label: <Link href="/dashboard/boat-trip">Boat And Trip</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Trip Calendar",
    icon: <TbCalendarEvent />,
    label: <Link href="/dashboard/trips-calender">Trip Calendar</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Manage Bookings",
    icon: <TbClipboardList />,
    label: <Link href="/dashboard/manage-bookings">Manage bookings</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Trips Management",
    icon: <TbRoute />,
    label: <Link href="/dashboard/trips-managment">Trips Management</Link>,
    roles: [userRole.fishingTripper],
  },
  {
    key: "Membership",
    icon: <TbCrown />,
    label: <Link href="/dashboard/membership">Membership</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Support",
    icon: <TbLifebuoy />,
    label: <Link href="/dashboard/support">Support</Link>,
    roles: [userRole.captain, userRole.user],
  },

  {
    key: "Reset Password",
    icon: <RxReset />,
    label: <Link href="/dashboard/reset-password">Change Password</Link>,
    roles: [userRole.captain, userRole.user, userRole.fishingTripper],
  },
];
