import Image from "next/image";
import dolphine from "@/assets/placeholder.webp";
import clock from "@/assets/icon/clock.svg";
import men from "@/assets/icon/men.svg";
import { IoLocationOutline } from "react-icons/io5";
import { useDeleteTripMutation } from "@/redux/api/boatApi";
import Swal from "sweetalert2";
import Link from "next/link";

type TripProps = {
  trip: {
    id: string;
    price: string;
    description: string;
    features: string[];
    duration: string;
    bookingType: string;
    tripName: string;
    fishingLocation: string[];
  };
  image?: string; // optional image URL
  guest: number;
  location?: string;
};

export default function TripCard({ trip, image, guest, location }: TripProps) {
  const hasValidImage = image && image.startsWith("http");

  const [deleteTrip] = useDeleteTripMutation();
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this trip!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteTrip(id);
        if (res?.data?.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your trip has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row  bg-white md:h-[260px] h-[460px] rounded-xl shadow p-4 gap-4 max-w-6xl">
      <div className="w-96 h-[239px] relative rounded-lg overflow-hidden">
        {hasValidImage ? (
          <Image
            src={image as string}
            alt="boat image"
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={dolphine}
            alt="default image"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="w-full flex flex-col justify-center">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="flex-1 sm:text-lg text-[24px] font-semibold w-96">
              {trip?.tripName}
            </h2>

            <div className="flex-1 flex  justify-end items-center gap-3 w-full md:w-72">
              <p className="text-[#9E9E9E] text-base font-normal leading-7 flex items-center gap-1">
                <IoLocationOutline className="text-[#FF9500] h-6 w-6 font-bold" />
                {location}
              </p>
              <p className="font-bold text-gray-800">Price: {trip?.price}</p>
            </div>
          </div>
          <p className="text-sm text-[#878787] mt-2">{trip?.description}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 justify-between items-center md:items-end">
          <div className="mt-4">
            <p className="font-semibold mb-2">Key features:</p>
            <div className="flex flex-wrap  md:flex-row w-full items-center gap-2 md:gap-4 mt-4">
              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={clock}
                  alt={"doller"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                {trip.bookingType} Group
              </div>

              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={clock}
                  alt={"clock"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                {trip.duration} Hours
              </div>

              <div className="flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base ">
                <Image
                  src={men}
                  alt={"men"}
                  height={100}
                  width={100}
                  className="w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg"
                />
                Up to {guest} people
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href={`/dashboard/edit-trip?id=${trip?.id}`}
              className="flex items-center gap-2 justify-center w-40 h-[40px] rounded-lg px-4 py-2 bg-[#FF9500] text-white hover:opacity-90 transition"
            >
              Edit Trip
              <svg
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.0019 16.9997C10.7361 17.0012 10.4806 16.8969 10.2919 16.7097C9.89977 16.3208 9.89717 15.6876 10.2861 15.2955C10.288 15.2935 10.29 15.2916 10.2919 15.2897L13.6019 11.9997L10.4219 8.68969C10.0342 8.29965 10.0342 7.66973 10.4219 7.27968C10.8108 6.88756 11.444 6.88497 11.8361 7.27389C11.838 7.27581 11.84 7.27774 11.8419 7.27968L15.7019 11.2797C16.083 11.6685 16.083 12.2908 15.7019 12.6797L11.7019 16.6797C11.5206 16.8755 11.2686 16.9907 11.0019 16.9997Z"
                  fill="white"
                />
              </svg>
            </Link>
            <button
              onClick={() => handleDelete(trip?.id)}
              className="flex items-center gap-2 justify-center w-40 h-[40px] rounded-lg px-4 py-2 bg-[#FF9500] text-white hover:opacity-90 transition"
            >
              Delete Trip
              <svg
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.0019 16.9997C10.7361 17.0012 10.4806 16.8969 10.2919 16.7097C9.89977 16.3208 9.89717 15.6876 10.2861 15.2955C10.288 15.2935 10.29 15.2916 10.2919 15.2897L13.6019 11.9997L10.4219 8.68969C10.0342 8.29965 10.0342 7.66973 10.4219 7.27968C10.8108 6.88756 11.444 6.88497 11.8361 7.27389C11.838 7.27581 11.84 7.27774 11.8419 7.27968L15.7019 11.2797C16.083 11.6685 16.083 12.2908 15.7019 12.6797L11.7019 16.6797C11.5206 16.8755 11.2686 16.9907 11.0019 16.9997Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
