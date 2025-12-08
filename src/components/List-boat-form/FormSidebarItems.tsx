import { BoatSidebarItem } from "@/types/dashboard.types";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { FaRegMap } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoFishOutline } from "react-icons/io5";
import { LuFileWarning, LuMessageCircleMore } from "react-icons/lu";
import { MdPhotoCameraBack } from "react-icons/md";

export const FormSidebarItems: BoatSidebarItem[] = [
  {
    key: "/boat-list-form/Information",
    icon: <LuFileWarning className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/Information">Information</Link>,
    activePath: [
      "/boat-list-form/Information",
      "/boat-list-form/Information",
      "/boat-list-form/photos-and-video",
      "/boat-list-form/fishing",
      "/boat-list-form/meeting-point",
      "/boat-list-form/description",
      "/boat-list-form/trips",
      "/boat-list-form/terms",
    ],
  },
  {
    key: "/boat-list-form/photos-and-video",
    icon: <MdPhotoCameraBack className="size-7 mr-2" />,
    label: (
      <Link href="/boat-list-form/photos-and-video">Photos and video</Link>
    ),
    activePath: [
      "/boat-list-form/photos-and-video",
      "/boat-list-form/fishing",
      "/boat-list-form/meeting-point",
      "/boat-list-form/description",
      "/boat-list-form/trips",
      "/boat-list-form/terms",
    ],
  },
  {
    key: "/boat-list-form/fishing",
    icon: <IoFishOutline className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/fishing">Fishing</Link>,
    activePath: [
      "/boat-list-form/meeting-point",
      "/boat-list-form/description",
      "/boat-list-form/trips",
      "/boat-list-form/terms",
    ],
  },
  {
    key: "/boat-list-form/meeting-point",
    icon: <CiLocationOn className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/meeting-point">Meeting point</Link>,
    activePath: [
      "/boat-list-form/description",
      "/boat-list-form/trips",
      "/boat-list-form/terms",
    ],
  },
  {
    key: "/boat-list-form/description",
    icon: <LuMessageCircleMore className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/description">Description</Link>,
    activePath: ["/boat-list-form/trips", "/boat-list-form/terms"],
  },
  {
    key: "/boat-list-form/trips",
    icon: <FaRegMap className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/trips">Trips</Link>,
    activePath: ["/boat-list-form/terms"],
  },
  {
    key: "/boat-list-form/terms",
    icon: <HiOutlineClipboardList className="size-7 mr-2" />,
    label: <Link href="/boat-list-form/terms">Terms</Link>,
  },
];
