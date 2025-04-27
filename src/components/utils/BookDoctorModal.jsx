import React, { useState } from "react";
import {
  Input,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createAppointmentAPI, createNotificationAPI } from "../../api/patient";
import { useAuth } from "../../provider/AuthProvider";

export function BookDoctorModal({ patientId, doctorId, disabled, buttonText }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    dateTime: new Date().toISOString().slice(0, 16),
  });

  const isGuest = !user;

  const handleOpen = () => setOpen((prev) => !prev);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const appointmentData = {
        patient_id: patientId || null,
        doctor_id: doctorId,
        date_time: formData.dateTime,
        status: "pending",
        payment_status: "unpaid",
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
      };

      await createAppointmentAPI(appointmentData);
      await createNotificationAPI(
        doctorId,
        `New appointment requested by ${formData.fullName}`,
        "pending",
      );

      handleOpen(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <>
      <Button
        disabled={disabled}
        onClick={handleOpen}
        className="w-full bg-[#858C9C]"
      >
        {buttonText}
      </Button>
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative">
          <Typography variant="h4" color="blue-gray">
            Book Appointment
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {isGuest
              ? "Enter your details to book an appointment as a guest."
              : "Complete the form below to book an appointment."}
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          {["fullName", "email", "phone", "dateTime"].map((field, index) => (
            <div key={index}>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                {field === "fullName"
                  ? "Full Name"
                  : field === "email"
                    ? "Email"
                    : field === "phone"
                      ? "Phone Number"
                      : "Date and Time"}
              </Typography>
              <Input
                color="gray"
                size="lg"
                type={field === "dateTime" ? "datetime-local" : "text"}
                value={formData[field]}
                onChange={handleChange(field)}
                disabled={
                  !isGuest && ["fullName", "email", "phone"].includes(field)
                }
                placeholder={`Enter your ${
                  field === "fullName"
                    ? "full name"
                    : field === "email"
                      ? "email"
                      : field === "phone"
                        ? "phone number"
                        : "date and time"
                }`}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" onClick={handleSubmit}>
            {isGuest ? "Book as Guest" : "Submit"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
