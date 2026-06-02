import { userRole } from "@/constant/user.constants";
import type { TSidebarItem } from "@/types/dashboard.types";
import Link from "next/link";
import { MdLockReset } from "react-icons/md";
import { TbSpeedboat } from "react-icons/tb";
import { FaRegAddressBook } from "react-icons/fa";

import {
  TbLayoutDashboard,
  TbUsers,
  TbSailboat,
  TbCalendarEvent,
  TbClipboardList,
  TbRoute,
  TbCrown,
  TbLifebuoy,
  TbCash,
} from "react-icons/tb";
import { MdChecklistRtl } from "react-icons/md";
import { PiUserListBold } from "react-icons/pi";

export const sidebarItems: TSidebarItem[] = [
  {
    key: "Dashboard",
    icon: <TbLayoutDashboard />,
    label: <Link href="/dashboard">Dashboard</Link>,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    key: "Edit your details",
    icon: <TbLayoutDashboard />,
    label: <Link href="/dashboard/edit-user-details">Edit your details</Link>,
    roles: [userRole.user],
  },
  {
    key: "Your Trips",
    icon: <TbSpeedboat />,
    label: <Link href="/dashboard/your-trips">Your Trips</Link>,
    roles: [userRole.user],
  },
  {
    key: "User Management",
    icon: <TbUsers />,
    label: <Link href="/dashboard/user-management">User Management</Link>,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    key: "Captain Management",
    icon: <PiUserListBold />,
    label: <Link href="/dashboard/captain-management">Captain Management</Link>,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    key: "Payout Requests",
    icon: <TbCash />,
    label: <Link href="/dashboard/payout-requests">Payout Requests</Link>,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    key: "Refund Management",
    icon: <TbCash />,
    label: <Link href="/dashboard/refund-management">Refund Management</Link>,
    roles: ["SUPERADMIN", "ADMIN"],
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
    key: "Payout Request",
    icon: <TbCash />,
    label: <Link href="/dashboard/payout-request">Payout Request</Link>,
    roles: [userRole.captain],
  },
  {
    key: "Trips Management",
    icon: <TbRoute />,
    label: <Link href="/dashboard/trips-managment">Trips Management</Link>,
    roles: [userRole.fishingTripper, "ADMIN"],
  },

  // {
  //   key: "Booking Management",
  //   icon: <FaRegAddressBook />,
  //   label: <Link href="/dashboard/booking-managment">Booking Management</Link>,
  //   roles: [userRole.fishingTripper, "ADMIN"],
  // },

  // Membership removed from captain dashboard
  {
    key: "Support",
    icon: <TbLifebuoy />,
    label: <Link href="/dashboard/support">Support</Link>,
    roles: [userRole.captain, userRole.user],
  },

  {
    key: "Reset Password",
    icon: <MdLockReset />,
    label: <Link href="/dashboard/reset-password">Change Password</Link>,
    roles: [userRole.captain, userRole.user, userRole.fishingTripper, "ADMIN"],
  },
];
