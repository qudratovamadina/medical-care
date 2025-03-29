import { NavLink } from "react-router-dom";

const RegisterHeader = ({ title }) => {
  return (
    <section
      id="home"
      className="relative flex h-[40dvh] w-full items-center justify-center bg-cover bg-center px-6 text-white md:px-12"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-2xl font-light">{title}</h1>
      </div>
    </section>
  );
};

export default RegisterHeader;
