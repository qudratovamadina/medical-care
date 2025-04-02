import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, Select, Option } from "@material-tailwind/react";
import { updateUserAPI } from "../api/auth";
import { useAuth } from "../provider/AuthProvider";

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

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    profileImg: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    specialty: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      const {
        profile_img,
        name,
        role,
        email,
        phone,
        address,
        specialty,
        dateOfBirth,
      } = user.user_metadata || {};
      setFormData({
        profileImg: profile_img || "",
        name: name || "",
        role: role || "",
        email: email || "",
        phone: phone || "",
        address: address || "",
        specialty: specialty || "",
        dateOfBirth: dateOfBirth || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserAPI({
        profile_img: formData.profileImg,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialty: formData.specialty,
        dateOfBirth: formData.dateOfBirth,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex h-full w-full overflow-y-scroll items-start justify-center p-4 sm:p-8">
      <Card color="transparent" shadow={false} className="w-full max-w-4xl">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Update Profile
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-center">
          Update your profile details below.
        </Typography>
        <form
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <FormField
            label="Profile Image URL"
            value={formData.profileImg}
            onChange={(value) => handleChange("profileImg", value)}
            placeholder="Profile Image URL"
            className="col-span-1 sm:col-span-2"
          />
          <FormField
            label="Your Name"
            value={formData.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Your Name"
          />
          <FormField
            label="Role"
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
            placeholder="Role (e.g., doctor, patient)"
          />
          <FormField
            label="Email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="Email"
          />
          <FormField
            label="Phone"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            placeholder="Phone Number"
          />
          <FormField
            label="Address"
            value={formData.address}
            onChange={(value) => handleChange("address", value)}
            placeholder="Address"
            className="col-span-1 sm:col-span-2"
          />
          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-1">
              Specialty
            </Typography>
            <Select
              value={formData.specialty}
              onChange={(value) => handleChange("specialty", value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            >
              {SPECIALTY_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <FormField
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(value) => handleChange("dateOfBirth", value)}
            placeholder="Date of Birth (YYYY-MM-DD)"
          />
          <Button
            type="submit"
            className="mt-6 bg-[#858C9C] col-span-1 sm:col-span-2"
            fullWidth
          >
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

const FormField = ({ label, value, onChange, placeholder, className }) => (
  <div className={`flex flex-col ${className}`}>
    <Typography variant="small" color="blue-gray" className="mb-1">
      {label}
    </Typography>
    <Input
      size="lg"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
      labelProps={{
        className: "before:content-none after:content-none",
      }}
    />
  </div>
);

export default Profile;