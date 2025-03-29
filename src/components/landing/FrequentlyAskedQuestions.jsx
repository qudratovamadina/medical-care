import { ChevronDown } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const FrequentlyAskedQuestions = () => {
  const faqs = [
    {
      question: "Do you accept new patients?",
      answer:
        "Unfortunately, no. We only accept patients by appointment. However, you can still book an appointment as we have only one main gynecologist.",
    },
    {
      question: "How can I make an appointment?",
      answer: "You can book an appointment online or call us anytime.",
    },
    {
      question: "Should I make appointments for analysis?",
      answer: "No, for analysis, we have a live queue system.",
    },
  ];

  return (
    <section id="faq" className="flex w-full flex-col items-center">
      <div className="relative flex h-60 w-full flex-col items-center justify-center px-4 text-center lg:px-0">
        <img
          src="./faq-bg.jpg"
          alt=""
          className="absolute left-0 top-0 z-0 h-full w-full object-cover brightness-50"
        />

        <div className="z-10 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-50 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-100">
            Find answers to common questions about our medical services.
          </p>
        </div>
      </div>
      <div className="container space-y-2 px-8 py-12 lg:px-0">
        {faqs.map((faq, index) => (
          <details key={index} className="group rounded-lg py-5">
            <summary className="flex w-fit cursor-pointer items-center justify-center gap-6 text-lg font-medium text-gray-900 group-open:text-purple-600">
              {faq.question}
              <span className="text-xl font-bold transition-transform group-open:rotate-180">
                <ChevronDown size={18} />
              </span>
            </summary>
            <p className="text-gray-700">{faq.answer}</p>
          </details>
        ))}

        <NavLink
          to="/book-doctors"
          className="mt-6 inline-block rounded border border-gray-900 px-6 py-3 text-lg transition hover:bg-gray-900 hover:text-white"
        >
          BOOK ONLINE
        </NavLink>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
