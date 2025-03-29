import React from "react";
import { DoctorsList } from "../components/booking/DoctorsList";
import { PatientsList } from "../components/booking/PatientsList";
import { useAuth } from "../provider/AuthProvider";

const MyAppointments = () => {
  const { role } = useAuth();
  const Component = role === "doctor" ? PatientsList : DoctorsList;

  return (
    <main className="flex h-full w-full flex-col gap-4">
      <Component />
    </main>
  );
};

export default MyAppointments;
