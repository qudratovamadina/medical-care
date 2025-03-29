import React from "react";
import Hero from "../components/landing/Hero";
import FrequentlyAskedQuestions from "../components/landing/FrequentlyAskedQuestions";
import Navbar from "../components/landing/Navbar";
import Location from "../components/landing/Location";
import Footer from "../components/landing/Footer";
import Services from "../components/landing/Services";

const LandingPage = () => {
  const sections = [
    <Hero key="hero" />,
    <Services key="services" />,
    <FrequentlyAskedQuestions key="faq" />,
    <Location key="location" />,
    <Footer key="footer" />,
  ];

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      {sections.map((Section, index) => (
        <React.Fragment key={index}>{Section}</React.Fragment>
      ))}
    </div>
  );
};

export default LandingPage;
