import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { signInAPI } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import RegisterHeader from "../../components/landing/RegisterHeader";

export function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signInAPI(formData);
      if (response.user.aud) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100">
      <Navbar />
      <RegisterHeader title="Log in to your account and access your data easily" />
      <section className="flex w-full flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md rounded-lg bg-[#858C9C] p-8 shadow-md">
          <Typography
            variant="h3"
            color="white"
            className="mb-6 text-center font-bold"
          >
            Log-in
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
            />
            <FormField
              id="password"
              label="Password"
              type={passwordShown ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              icon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white"
                >
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />
            <Button
              type="submit"
              color="white"
              size="lg"
              fullWidth
              className="bg-blue-600 hover:bg-blue-500"
            >
              Login
            </Button>
          </form>
          <Typography className="mt-4 text-center text-white">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-200 hover:underline">
              Sign up here
            </a>
          </Typography>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const FormField = ({ id, label, type, placeholder, value, onChange, icon }) => (
  <div className="relative space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full border border-gray-600 bg-[#858C9C] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
    />
    {icon}
  </div>
);

export default Signin;
