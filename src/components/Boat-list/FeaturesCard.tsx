// // app/page.tsx or pages/index.tsx
// "use client";

// import { FaSearchDollar } from "react-icons/fa";
// import { LuMaximize2 } from "react-icons/lu";
// import { RiGlobalLine } from "react-icons/ri";
// import { TbRocket } from "react-icons/tb";

// export default function FeaturesCard() {
//   const featuresData = [
//     {
//       id: 1,
//       title: "Global Exposure",
//       description: "Get seen by anglers in your region and around the world.",
//       icon: <RiGlobalLine />,
//     },
//     {
//       id: 2,
//       title: "Fast & Easy Setup",
//       description: "Simply list your boat, get approved and you’re live!",
//       icon: <TbRocket />,
//     },
//     {
//       id: 3,
//       title: "Secure Payments",
//       description: "All transactions are protected and encrypted.",
//       icon: <FaSearchDollar />,
//     },
//     {
//       id: 4,
//       title: "24/7 Support",
//       description: "We’re here to help any time, any day.",
//       icon: <FaSearchDollar />,
//     },
//     {
//       id: 5,
//       title: "Maximise Revenue",
//       description:
//         "Take bookings for private and  hassle-free shared charters (optional).",
//       icon: <LuMaximize2 />,
//     },
//   ];

//   return (
//     <main className=" flex items-center justify-center container mx-auto py-20 px-5 xl:px-0">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6 w-full">
//         {featuresData?.map((feature) => (
//           <div
//             key={feature.id}
//             className="bg-white rounded-md  p-6 transition feature-card"
//           >
//             <div className="text-blue-600 text-2xl mb-4">{feature.icon}</div>
//             <h3 className="text-lg md:text-2xl font-normal leading-[52px] text-gray-900 mb-2">
//               {feature.title}
//             </h3>
//             <p className="text-[#878787] text-sm md:text-lg font-normal leading-7">
//               {feature.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";

import { FaSearchDollar } from "react-icons/fa";
import { LuMaximize2 } from "react-icons/lu";
import { RiGlobalLine } from "react-icons/ri";
import { TbRocket } from "react-icons/tb";
import Container from "../common/Container";

export default function FeaturesCard() {
  const featuresData = [
    {
      id: 1,
      title: "Global Exposure",
      description: "Get seen by anglers in your region and around the world.",
      icon: <RiGlobalLine />,
    },
    {
      id: 2,
      title: "Fast & Easy Setup",
      description: "Simply list your boat, get approved and you’re live!",
      icon: <TbRocket />,
    },
    {
      id: 3,
      title: "Secure Payments",
      description: "All transactions are protected and encrypted.",
      icon: <FaSearchDollar />,
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "We’re here to help any time, any day.",
      icon: <FaSearchDollar />,
    },
    {
      id: 5,
      title: "Maximise Revenue",
      description:
        "Take bookings for private and  hassle-free shared charters (optional).",
      icon: <LuMaximize2 />,
    },
  ];

  return (
    <Container className="flex items-center justify-center">
      {/* Changed from grid to flex with wrap and justify-center */}
      <div className="flex flex-wrap justify-center lg:gap-8 md:gap-6.5 gap-5 w-full">
        {featuresData?.map((feature) => (
          <div
            key={feature.id}
            // Added explicit widths to mimic the 1, 2, and 3 column layout
            className="bg-white rounded-md p-6 transition feature-card w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]"
          >
            <div className="text-[#105e9e] text-2xl mb-4 w-5 h-5">
              {feature.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-normal leading-[52px] text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-[#878787] text-base md:text-lg font-normal leading-7">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
