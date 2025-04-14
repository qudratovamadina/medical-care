import React from "react";
import { NavLink } from "react-router-dom";

const Services = () => {
  return (
    <section id="services" className="bg-white py-16 text-gray-900">
      <div className="container mx-auto px-6 md:px-0 2xl:flex 2xl:items-center 2xl:space-x-8">
        {/* Left Text Content */}
        <div className="2xl:w-1/2">
          <h2 className="text-4xl font-semibold">Our Services</h2>
          <p className="mt-4 text-lg">
            Hello and welcome to our gynecological clinic <b>Medical Care</b>.
          </p>
          <p className="mt-2 text-lg">
            At Medical Care, we are committed to empowering women with
            high-quality healthcare tailored to their unique needs. Our goal is
            to promote wellness, provide expert medical care, and support women
            through every stage of life.
          </p>
          <p className="mt-4 text-lg">
            Please feel free to contact us anytime with health-related inquiries
            or to schedule an appointment.
          </p>
          <NavLink
            to="/book-doctors"
            className="mt-6 inline-block rounded border border-gray-900 px-6 py-3 text-lg transition hover:bg-gray-900 hover:text-white"
          >
            BOOK ONLINE
          </NavLink>
        </div>

        {/* Right Image */}
        <div className="mt-10 2xl:mt-0 2xl:w-1/2">
          <img
            src="/services-img.jpg"
            alt="Doctor consulting a patient"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="container mx-auto mt-16 px-6 md:px-12">
        <h3 className="text-center text-3xl font-medium">
          Our clinic provides the following medical services:
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
          {[
            "Routine check-ups and preventive care",
            "Family planning and contraception counseling",
            "Prenatal and postnatal care",
            "Menstrual health management",
            "Menopause support and hormone therapy",
            "Diagnosis and treatment of gynecological conditions",
            "Laboratory services and nurse services",
          ].map((service, index) => (
            <div key={index} className="text-lg font-light">
              <span className="block text-3xl font-semibold">{index + 1}</span>
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
