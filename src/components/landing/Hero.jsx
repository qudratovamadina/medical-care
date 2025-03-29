import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex h-[80dvh] w-full items-center justify-center bg-cover bg-center px-6 text-white md:px-12"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-lg font-light">Welcome To</p>
        <h1 className="text-5xl font-semibold md:text-6xl">
          Medical Care Clinic
        </h1>
        <div className="mt-6 flex gap-4">
          <NavLink
            to="/book-doctors"
            className="rounded border border-white px-6 py-3 text-lg transition hover:bg-white hover:text-gray-900"
          >
            BOOK ONLINE
          </NavLink>
          <NavLink
            to="tel:+998881880039"
            className="rounded border border-white px-6 py-3 text-lg transition hover:bg-white hover:text-gray-900"
          >
            CALL
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Hero;
