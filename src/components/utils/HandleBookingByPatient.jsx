import React, { useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
import { createNotificationAPI } from "../../api/patient";
import DoctorFeedbackForm from "../booking/DoctorFeedbackForm";
import { confirmAppointmentAPI } from "../../api/doctor";

export function HandleBookingByPatient({
  patientName,
  doctorId,
  doctorName,
  appointmentId,
  patientId,
  dateTime,
  status,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await confirmAppointmentAPI({
        appointmentId,
        status: selectedStatus,
      });

      await createNotificationAPI(
        doctorId,
        `${patientName} updated their appointment status to ${selectedStatus}.`,
        selectedStatus,
      );

      setOpen(false);

      if (selectedStatus === "completed") {
        setFeedbackOpen(true);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outlined"
        color="gray"
        className="ml-auto flex w-full justify-center gap-3 md:max-w-fit"
        onClick={handleOpen}
        disabled={status == "cancelled"}
      >
        <PlusIcon strokeWidth={3} className="h-4 w-4" />
        Update
      </Button>

      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Update Appointment
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Update the status of your appointment.
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
          <Typography variant="h6" color="blue-gray">
            Patient: {patientName}
          </Typography>
          <Typography variant="h6" color="blue-gray">
            Date & Time: {new Date(dateTime).toLocaleString()}
          </Typography>
          <Select
            label="Appointment Status"
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            disabled={status === "completed"}
          >
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={handleOpen}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button className="ml-2" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </Dialog>

      {feedbackOpen && (
        <Dialog
          open={feedbackOpen}
          handler={() => setFeedbackOpen(false)}
          size="sm"
        >
          <DialogHeader>Feedback for Dr. {doctorName}</DialogHeader>
          <DialogBody>
            <DoctorFeedbackForm
              appointmentId={appointmentId}
              doctorId={doctorId}
              patientId={patientId}
              onSubmit={() => setFeedbackOpen(false)}
            />
          </DialogBody>
        </Dialog>
      )}
    </>
  );
}
