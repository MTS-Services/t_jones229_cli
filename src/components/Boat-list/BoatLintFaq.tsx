"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../common/Container";
// 1. Import icons from react-icons
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSection {
  category: string;
  questions: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    category: "Payments & Pricing",
    questions: [
      {
        id: 1,
        question: "How do I get paid?",
        answer:
          "Payments are processed securely via Stripe and sent directly to your Account.",
      },
      {
        id: 2,
        question: "Can I set my own prices?",
        answer:
          "Yes! You have full control over pricing and can adjust it at any time.",
      },
      {
        id: 3,
        question:
          "What impacts where my listing ranks amongst the other listings in my area?",
        answer:
          "Our site ranks listings in price order. The search results display can be adjusted by the customer to rank results either lowest price first or highest price first.",
      },
    ],
  },
  {
    category: "Bookings & Calendar",
    questions: [
      {
        id: 4,
        question: "How do I avoid double bookings?",
        answer:
          "Once your listing has been verified, you will have access to the dashboard page. From there you can view and manage your calendar. If you receive a booking from outside of FishingTripper you can block the day off in your calendar so that you don't get double booked.",
      },
      {
        id: 5,
        question: "How do I choose when I work?",
        answer:
          "When you create your listing you select which days your trips are available. This will then be visible on your calendar which you can access and manage through your dashboard.",
      },
      {
        id: 6,
        question: "How do I know when I have received a booking?",
        answer:
          "We will email you when you have been booked. The booking will also be visible on your calendar on the dashboard page.",
      },
      {
        id: 7,
        question: "How do I contact customers once they have booked a trip?",
        answer:
          "Once a booking is confirmed, you will have access to the customers contact mobile number and email address. They will also have your contact information.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    questions: [
      {
        id: 8,
        question: "What happens if the customer cancels?",
        answer:
          "We have a range of cancellation policy options that you can choose from during the sign up process. Choose the level of protection that suits you best. This will be visible to customers and must be accepted when they book.",
      },
      {
        id: 9,
        question: "What happens if a trip is cancelled due to bad weather?",
        answer:
          "You're in full control of weather cancellations. Even if the cancellation is last minute, the customer will receive a full refund and we won't charge you commission for that trip.",
      },
      {
        id: 10,
        question:
          "What happens if a trip is cancelled part way through due to weather or unforeseen circumstances?",
        answer:
          "In this case, the customer will be refunded for the amount of the trip that they missed. For example if the trip was supposed to be 4 hours long and you had to return to dock after two hours due to weather, they will be refunded for the 2 hours that were missed.",
      },
    ],
  },
  {
    category: "Trip Customization",
    questions: [
      {
        id: 11,
        question: "Can I limit the number of anglers on my boat?",
        answer:
          "Yes you can set your angler capacity during the listing process and amend it at any time.",
      },
      {
        id: 12,
        question: "How do Shared Trips work?",
        answer:
          "When you create your listing, you can choose whether to accept Shared Trips. If enabled, your charter can be booked by individual anglers who are grouped together to split the cost of the trip. FishingTripper handles the grouping, booking, and payments, so there's no extra admin for you. You'll simply see multiple anglers on the same trip instead of a single private group, with all participant details provided in advance.",
      },
    ],
  },
];

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
      className={`group relative mb-4 overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 ${
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
          className={`text-base font-semibold ${
            isOpen ? "text-[#0f5d9e]" : "text-gray-500"
          }`}
        >
          {item.question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 items-center justify-center rounded-full"
        >
          {/* 2. Replaced custom SVG with React Icon component */}
          <MdKeyboardArrowDown size={24} />
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
              <p className="text-gray-600 text-lg leading-relaxed">
                {item.answer}
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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
     
        <header className="mb-12 text-center">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-black text-gray-900 mb-4">
            Frequently Asked <span className="text-[#0f5d9e]">Questions (FAQ).</span>
          </h1>
          <p className="md:text-lg text-sm font-medium text-black max-w-2xl mx-auto">
            "We welcome any feedback or suggestions from our captains. Please
            contact us at anytime to discuss your thoughts or any issues you're
            facing."
          </p>
        </header>

        <div className="space-y-14">
          {FAQ_DATA.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="my-4 text-xl font-black text-gray-700 flex items-center gap-4">
                {section.category}
                <div className="h-[1px] flex-grow bg-gray-300" />
              </h2>

              <div className="space-y-4">
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
  );
}
