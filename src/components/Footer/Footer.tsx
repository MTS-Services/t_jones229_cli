import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO_ALT, BRAND_LOGO_URL } from "@/constant/brand.constants";

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Contact Us", "FAQ"],
    },
    {
      title: "Help & Support",
      links: ["Customer Service", "Booking Issues", "Payment Queries"],
    },
    {
      title: "Legal & Policies",
      links: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12 mb-8 md:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-start gap-6">
              <Link href="/" className="inline-block">
                <Image
                  src={BRAND_LOGO_URL}
                  alt={BRAND_LOGO_ALT}
                  height={100}
                  width={100}
                  unoptimized
                  className="w-36 h-auto object-contain"
                />
              </Link>

              <div className="flex gap-6">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="hover:text-indigo-400 transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm hover:text-indigo-400 hover:underline transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 py-4 text-center md:text-left">
          <p className="text-sm text-center text-slate-500">
            © {new Date().getFullYear()} The Fishing Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
