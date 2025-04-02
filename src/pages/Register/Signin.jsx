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
  const [errors, setErrors] = useState({ email: "", password: "", apiError: "" });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear field-specific errors
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await signInAPI(formData);
      if (response.user?.aud) {
        navigate("/dashboard");
      } else {
        setErrors((prev) => ({
          ...prev,
          apiError: "Invalid email or password. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        apiError: "An error occurred during login. Please try again later.",
      }));
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
              error={errors.email}
            />
            <FormField
              id="password"
              label="Password"
              type={passwordShown ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              error={errors.password}
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
            {errors.apiError && (
              <Typography color="red" className="text-center">
                {errors.apiError}
              </Typography>
            )}
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

const FormField = ({ id, label, type, placeholder, value, onChange, icon, error }) => (
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
      className={`w-full border px-3 py-2 text-white focus:outline-none ${
        error ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-blue-500"
      }`}
    />
    {icon}
    {error && <Typography color="red" className="text-sm">{error}</Typography>}
  </div>
);

export default Signin;