import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { signUpAPI } from "../../api/auth";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import RegisterHeader from "../../components/landing/RegisterHeader";

const INITIAL_FORM_DATA = {
  email: "",
  password: "",
  name: "",
  role: "patient",
  specialty: "",
  phone: "",
  address: "",
  dateOfBirth: "",
};

const INITIAL_ERRORS = {
  email: "",
  password: "",
  name: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  specialty: "",
};

const ROLE_OPTIONS = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
];

const SPECIALTY_OPTIONS = [
  { value: "gynecologist", label: "Gynecologist" },
  { value: "uzist", label: "Uzist" },
  { value: "medsestra", label: "Medsestra" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "general", label: "General" },
];

export function Signup() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear field-specific errors
  };

  const validateForm = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
      isValid = false;
    }

    if (formData.role === "doctor" && !formData.specialty) {
      newErrors.specialty = "Specialty is required for doctors.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { role, specialty, ...userData } = formData;
    userData.role = role;

    if (role === "doctor") {
      userData.specialty = specialty;
    }

    try {
      const response = await signUpAPI(userData);
      if (response.user.aud) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100">
      <Navbar />
      <RegisterHeader title="Create your account" />
      <section className="flex w-full flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full min-w-fit max-w-md rounded-lg bg-[#858C9C] p-8 shadow-md">
          <Typography
            variant="h3"
            color="white"
            className="mb-6 text-center font-bold"
          >
            Sign-up
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <FormField
                id="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange("name")}
                error={errors.name}
              />
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                error={errors.email}
              />
            </div>
            <FormField
              id="password"
              label="Password"
              type={passwordShown ? "text" : "password"}
              placeholder="********"
              value={formData.password}
              onChange={handleChange("password")}
              error={errors.password}
              icon={
                <i
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                >
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
            <div className="flex flex-col gap-4 lg:flex-row">
              <FormField
                id="phone"
                label="Phone Number"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleChange("phone")}
                error={errors.phone}
              />
              <FormField
                id="address"
                label="Address"
                type="text"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleChange("address")}
                error={errors.address}
              />
            </div>
            <FormField
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              error={errors.dateOfBirth}
            />
            <SelectField
              id="role"
              label="Role"
              value={formData.role}
              onChange={handleChange("role")}
              options={ROLE_OPTIONS}
            />
            {formData.role === "doctor" && (
              <SelectField
                id="specialty"
                label="Specialty"
                value={formData.specialty}
                onChange={handleChange("specialty")}
                options={SPECIALTY_OPTIONS}
                error={errors.specialty}
              />
            )}
            <Button type="submit" color="white" size="lg" fullWidth>
              Sign Up
            </Button>
          </form>

          <Typography className="mt-4 text-center text-white">
            Already have an account?{" "}
            <a href="/login" className="text-blue-200 hover:underline">
              Sign in here
            </a>
          </Typography>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const FormField = ({ id, label, type, placeholder, value, onChange, icon, error }) => (
  <div className="space-y-1">
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
      icon={icon}
      className={`w-full ${error ? "border-red-500" : ""}`}
    />
    {error && <Typography color="red" className="text-sm">{error}</Typography>}
  </div>
);

const SelectField = ({ id, label, value, onChange, options, error }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label}
    </label>
    <Select id={id} value={value} onChange={onChange} className={`w-full ${error ? "border-red-500" : ""}`}>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
    {error && <Typography color="red" className="text-sm">{error}</Typography>}
  </div>
);

export default Signup;