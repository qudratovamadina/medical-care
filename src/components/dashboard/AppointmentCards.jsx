import React, { useEffect, useState } from "react";
import { Button, Card } from "@material-tailwind/react";
import { getAppointmentsByDoctorIdAPI } from "../../api/doctor";
import { getAppointmentsByPatientIdAPI } from "../../api/patient";
import { NavLink } from "react-router-dom";

const AppointmentCards = ({ userId, role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId || !role) return;

      setLoading(true);
      setError(null);

      try {
        const response =
          role === "doctor"
            ? await getAppointmentsByDoctorIdAPI(userId)
            : await getAppointmentsByPatientIdAPI(userId);

        setAppointments(response?.appointments || []);
      } catch {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, role]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointments.length) return <p>No appointments available.</p>;

  return (
    <div className="max-w-dvw flex h-fit gap-4 overflow-hidden overflow-x-scroll py-4">
      {appointments.map((appointment, index) => (
        <AppointmentCard
          key={index}
          fullName={appointment.name}
          appointmentDate={appointment.date_time}
          status={appointment.status}
        />
      ))}
    </div>
  );
};

const AppointmentCard = ({ fullName, appointmentDate, status }) => (
  <Card className="flex min-h-fit w-48 min-w-48 flex-col justify-between gap-1 border p-4 shadow-none hover:shadow-md">
    <h3 className="text-lg">{fullName}</h3>
    <p className="text-sm">{appointmentDate}</p>
    <span className="w-fit rounded-lg bg-pink-50 px-3 py-1 text-xs">
      {status}
    </span>
    <Button className="mt-2 bg-[#858C9C] py-2 text-xs">
      <NavLink to="/appointments">View Details</NavLink>
    </Button>
  </Card>
);

export default AppointmentCards;
