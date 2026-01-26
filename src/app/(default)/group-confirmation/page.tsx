import Link from "next/link";
import React from "react";
import { MdEmail } from "react-icons/md";

export default function page() {
  return (
    // <div className="mt-36 h-[85vh] xl:px-6 lg:px-5 md:px-4 px-3">
    //   <div className="container mx-auto px-7 pt-8 pb-24 bg-[#f0f6ff] rounded-lg">
    //     <h1 className="font-sk-modernist text-black text-xl md:text-[40px] text-center font-extrabold leading-normal md:leading-[60px] tracking-tight mb-6 ">
    //     You're on the Shared Trip list
    //     </h1>

    //     <div className="space-y-4">
    //       <p className="font-inter text-[#242424] text-base md:text-lg font-normal leading-7">
    //         Thanks for registering your interest in a Shared Trip. We'll now work to pair you with like-minded anglers and a suitable charter based on your preferences.
    //       </p>

    //       <p className="text-base md:text-lg font-normal leading-7 ">As soon as a match is confirmed, you'll receive an email with full trip details and next steps.</p>



    //       <p className=" flex items-center ">
    //         Questions or changes? <MdEmail />tom@fishingtripper.com

    //       </p>

    //       <p className="font-inter text-[#242424] text-base md:text-[18px] font-normal leading-7">
    //         <span className="text-base md:text-xl font-bold">
    //           {" "}
    //           Want to guarantee your trip?{" "}
    //         </span>
    //         <Link href="/" className="text-blue-600 underline">
    //           Search for a private hire
    //         </Link>{" "}
    //         instead.
    //       </p>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-blue-100">
    
    {/* Success Icon or Illustration (Optional but Recommended) */}
    <div className="flex justify-center mb-6">
      <div className="bg-green-100 p-3 rounded-full">
        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    {/* Heading */}
    <h1 className="font-sk-modernist text-slate-900 text-3xl md:text-4xl text-center font-extrabold tracking-tight mb-6">
      You're on the <span className="text-blue-600">Shared Trip</span> list!
    </h1>

    <div className="space-y-6 text-center md:text-left">
      <p className="font-inter text-slate-600 text-base md:text-lg leading-relaxed">
        Thanks for registering your interest. We'll now work to pair you with like-minded anglers and a suitable charter based on your preferences.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
        <p className="text-blue-800 text-base font-medium">
          Next Step: As soon as a match is confirmed, you'll receive an email with full trip details.
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <MdEmail className="text-blue-500 text-xl" />
          <span className="text-sm">Questions?</span>
          <a href="mailto:tom@fishingtripper.com" className="font-semibold text-slate-800 hover:text-blue-600 transition">
            tom@fishingtripper.com
          </a>
        </div>

        {/* CTA Button */}
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#70b6f0] hover:bg-[#105d9e] transition-colors shadow-md"
        >
          Search Private Hire instead
        </Link>
      </div>
    </div>
  </div>
</div>
  );
}
