"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../common/Container";

interface FAQItem {
  id: number;
  q: string;
  a: string;
}

interface FAQSection {
  category: string;
  questions: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    category: "Getting Started",
    questions: [
      {
        id: 1,
        q: "How do I list my boat?",
        a: "Follow the 'List Your Boat' prompt on the dashboard to enter your boat details and upload photos.",
      },
      {
        id: 2,
        q: "Does it cost anything to list my boat?",
        a: "No! You get a 6-month free trial with unlimited trip listings. After that, it's a flat £50/month with no hidden fees or commissions.",
      },
      {
        id: 3,
        q: "What happens after I submit my listing?",
        a: "Our team reviews the listing for quality and safety. Once approved, it goes live immediately.",
      },
    ],
  },
  {
    category: "Pricing & Earnings",
    questions: [
      {
        id: 4,
        q: "How do I get paid?",
        a: "Payments are processed securely via Stripe and sent directly to your bank account.",
      },
      {
        id: 5,
        q: "Can I set my own prices?",
        a: "Yes! You have full control over pricing for both private bookings (full boat rental) and group bookings (per seat pricing).",
      },
      {
        id: 6,
        q: "Are there any hidden fees?",
        a: "No, we believe in transparency. There are no commission fees or hidden costs beyond the monthly subscription.",
      },
      {
        id: 7,
        q: "What happens if a customer cancels?",
        a: "Our cancellation policy protects hosts. You can choose the level of protection that works best for your business.",
      },
    ],
  },
  {
    category: "Availability & Managing Trips",
    questions: [
      {
        id: 8,
        q: "Can I block out certain dates when I'm unavailable?",
        a: "Yes, our calendar system allows you to manage your availability in real-time.",
      },
      {
        id: 9,
        q: "Can I limit the number of passengers on my boat?",
        a: "Yes! You have full control over pricing for both private bookings (full boat rental) and group bookings (per seat pricing).",
      },
      {
        id: 10,
        q: "Can I change my pricing or availability later?",
        a: "Absolutely. You can update your listing details, prices, and calendar at any time from your dashboard.",
      },
    ],
  },
];

// Icons for accordion
const MdOutlineKeyboardArrowDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const MdOutlineKeyboardArrowUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
);

const AccordionCard = ({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative mb-4 overflow-hidden rounded-xl border transition-all duration-300 ${
        isOpen
          ? "border-[#0f5d9e] bg-white shadow-sm"
          : "border-transparent bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span
          className={`text-lg font-semibold ${
            isOpen ? "text-[#0f5d9e]" : "text-gray-800"
          }`}
        >
          {item.q}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex h-8 w-8 items-center justify-center rounded-full `}
        >
          {isOpen ? (
            <MdOutlineKeyboardArrowUp />
          ) : (
            <MdOutlineKeyboardArrowDown />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <div className="px-5 pb-5">
              <div className="h-[1px] w-full bg-[#78b4e6]/30 mb-3" />
              <p className="text-gray-500 text-base leading-relaxed">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function PremiumFaq() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <Container className="">
      <div className="">
        <header className="mb-8 text-left">
          <span className="md:text-base text-sm font-medium text-black">
            We welcome any feedback or suggestions from our captains...
          </span>
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-black text-gray-900 mt-1">
            Frequently Asked <span className="text-[#0f5d9e]">Questions.</span>
          </h1>
        </header>

        <div className="space-y-14">
          {FAQ_DATA.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="my-4 text-lg font-black text-gray-700 flex items-center gap-4">
                {section.category}
                <div className="h-[2px] flex-grow bg-gray-200" />
              </h2>

              <div className="space-y-6">
                {section.questions.map((item) => (
                  <AccordionCard
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onClick={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
