import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";

import logo from "@/assets/logo2.svg";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    
     <section className="">
        {/* <div className="text-center mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">Concept 2: The Mega Footer</span>
        </div> */}
 
        {/* <!-- Footer Start --> */}
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-10">
                   
                    {/* <!-- Brand Column --> */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-col items-start justify-start  gap-2">
                            <div className=" rounded-lg  ">

              <Image
              src={logo}
              alt="logo"
              height={100}
              width={100}
              className="w-36"
            />
                                
                            </div>
                           
                        <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-xs">
                           I'm surprised you had the courage to take the
responsibility yourself. Leave that to me.
                        </p>


                 <div className="flex gap-8 items-center ">
              {/* <FaTwitter
                className=" h-5 w-5 cursor-pointer transition-colors duration-300 ease-in-out"
                size={20}
              /> */}
              <FaFacebookF
                className=" h-5 w-5 cursor-pointer transition-colors duration-300 ease-in-out"
                size={20}
              />

              <FaInstagram
                className=" h-5 w-5 cursor-pointer transition-colors duration-300 ease-in-out"
                size={20}
              />
              <FaYoutube
                className=" h-5 w-5 cursor-pointer transition-colors duration-300 ease-in-out"
                size={20}
              />
            </div>

                        </div>
            
                    </div>
 
                    {/* <!-- Links Column 1 --> */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">HEADING</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="/contact-us"  className="hover:text-indigo-400 transition hover:underline">CONTACT US</a></li>
                            <li><a   href="/faq" className="hover:text-indigo-400 transition hover:underline">FAQ</a></li>
                            <li className="hover:text-indigo-400 transition hover:underline">Footer Link #3</li>
                            <li className="hover:text-indigo-400 transition hover:underline">Footer Link #4</li>
                            <li className="hover:text-indigo-400 transition hover:underline">Footer Link #5</li>
                        </ul>
                    </div>
 
                    {/* <!-- Links Column 2 --> */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">HEADING</h3>
                        <ul className="space-y-4 text-sm">
                        <li className="hover:text-indigo-400 transition      hover:underline">Footer Link #1 </li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #2 </li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #3</li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #4</li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #5</li>
                        </ul>
                    </div>
 
                    {/* <!-- Links Column 3 --> */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">HEADING</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #1</li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #2 </li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #3</li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #4</li>
                            <li className="hover:text-indigo-400 transition  hover:underline">Footer Link #5</li>
                        </ul>  
                    </div>
                </div>
 
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">Copyright &copy;2024. Fishing tripper.</p>
                    
                </div>
            </div>
        </footer>
        {/* <!-- Footer End --> */}
    </section>
    
  );
};

export default Footer;
