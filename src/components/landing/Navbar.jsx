import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex w-full items-center justify-center bg-white">
      <nav className="container flex h-20 w-full items-center justify-between bg-white bg-cover bg-center px-6 md:px-0">
        <NavLink to="/">
          <img src="./logo.svg" alt="Medical Care Logo" className="h-12" />
        </NavLink>
        <ul
          className={`absolute left-0 top-20 z-50 w-full flex-col items-center gap-4 bg-white py-4 shadow-md transition-transform md:static md:flex md:flex-row md:gap-8 md:shadow-none 2xl:w-fit ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          <li className="cursor-pointer text-lg text-gray-700 hover:text-[#31A02D]">
            <NavLink to="/">Home</NavLink>
          </li>
          {[
            { name: "FAQ", href: "#faq" },
            { name: "Location", href: "#location" },
          ].map((item) => (
            <li
              key={item.name}
              className="cursor-pointer text-lg text-gray-700 hover:text-[#31A02D]"
            >
              <a href={item.href} className="">
                {item.name}
              </a>
            </li>
          ))}
          <li>
            {!loading && user ? (
              <NavLink
                to="/dashboard"
                className="rounded bg-[#858C9C] px-6 py-2 text-white transition hover:bg-[#6934d4]"
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="border-b border-b-[#858C9C] py-2 text-gray-700 transition hover:bg-[#c9c8cc]"
              >
                LOG-IN | SIGN-UP
              </NavLink>
            )}
          </li>
        </ul>
        <button
          className="text-2xl md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
