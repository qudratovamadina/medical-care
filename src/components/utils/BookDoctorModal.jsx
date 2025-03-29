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

export function BookDoctorModal({ patientId, doctorId, patientName }) {
  const { user, role, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  // Guest user fields
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const isGuest = !user;

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    try {
      const appointmentData = {
        patient_id: patientId || null,
        doctor_id: doctorId,
        date_time: dateTime,
        status,
        payment_status: paymentStatus,
        full_name: user?.user_metadata?.name || guestName,
        email: user?.email || guestEmail,
        phone_number: user?.user_metadata?.phone || guestPhone,
      };

      await createAppointmentAPI(appointmentData);
      await createNotificationAPI(
        doctorId,
        `New appointment requested by ${user?.user_metadata?.name || guestName}`,
        "pending",
      );

      handleOpen(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} className="w-full bg-[#858C9C]">
        Book
      </Button>
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
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
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Full Name
            </Typography>
            <Input
              color="gray"
              size="lg"
              type="text"
              value={isGuest ? guestName : user?.user_metadata?.name}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={!isGuest}
              placeholder="Enter your full name"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{ className: "!min-w-full" }}
              labelProps={{ className: "hidden" }}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Email
            </Typography>
            <Input
              color="gray"
              size="lg"
              type="email"
              value={isGuest ? guestEmail : user?.email}
              onChange={(e) => setGuestEmail(e.target.value)}
              disabled={!isGuest}
              placeholder="Enter your email"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{ className: "!min-w-full" }}
              labelProps={{ className: "hidden" }}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Phone Number
            </Typography>
            <Input
              color="gray"
              size="lg"
              type="text"
              value={isGuest ? guestPhone : user?.user_metadata?.phone}
              onChange={(e) => setGuestPhone(e.target.value)}
              disabled={!isGuest}
              placeholder="Enter your phone number"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{ className: "!min-w-full" }}
              labelProps={{ className: "hidden" }}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Date and Time
            </Typography>
            <Input
              color="gray"
              size="lg"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{ className: "!min-w-full" }}
              labelProps={{ className: "hidden" }}
            />
          </div>
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
