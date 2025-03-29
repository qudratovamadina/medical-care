import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { TopNavbar } from "../components/TopNavbar";
import { updateUserAPI } from "../api/auth";
import { useAuth } from "../provider/AuthProvider";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    profileImg: "",
    name: "",
    specialty: "",
  });

  useEffect(() => {
    if (user) {
      const { profile_img, name, specialty } = user.user_metadata || {};
      setFormData({
        profileImg: profile_img || "",
        name: name || "",
        specialty: specialty || "",
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
        specialty: formData.specialty,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Update Profile
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Update your profile details below.
        </Typography>
        <form
          className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <FormField
              label="Profile Image URL"
              value={formData.profileImg}
              onChange={(value) => handleChange("profileImg", value)}
              placeholder="Profile Image URL"
            />
            <FormField
              label="Your Name"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              placeholder="Your Name"
            />
            <FormField
              label="Specialty"
              value={formData.specialty}
              onChange={(value) => handleChange("specialty", value)}
              placeholder="Specialty"
            />
          </div>
          <Button type="submit" className="mt-6 bg-[#858C9C]" fullWidth>
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

const FormField = ({ label, value, onChange, placeholder }) => (
  <>
    <Typography variant="h6" color="blue-gray" className="-mb-3">
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
  </>
);

export default Profile;
