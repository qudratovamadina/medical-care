import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#3D4049] py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 px-6 md:px-12 2xl:flex-row 2xl:gap-0">
        <div className="text-center md:text-left">
          <div className="mb-2 flex items-center justify-center md:justify-start">
            <img
              src="./logo.svg"
              alt="Medical Care Clinic Logo"
              className="mr-2 h-8 w-8"
            />
            <h2 className="text-2xl font-light">Medical Care Clinic</h2>
          </div>
          <p className="text-gray-300">Tashkent, Badamzar 8</p>
          <p className="text-gray-300">+998 88 188 00 39</p>
        </div>
        <nav className="text-center md:text-left">
          <ul className="space-y-2 text-gray-300">
            <li>Services</li>
            <li>FAQ</li>
            <li>Location & Hours</li>
            <li>Contact Us</li>
          </ul>
        </nav>
        <div className="flex flex-col space-y-4">
          <button className="rounded-md border border-gray-300 px-6 py-2 text-gray-300 hover:bg-gray-500/20">
            BOOK ONLINE
          </button>
          <a
            href="tel:+998881880039"
            className="rounded-md border border-gray-300 px-6 py-2 text-center text-gray-300 hover:bg-gray-500/20"
          >
            CALL
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
