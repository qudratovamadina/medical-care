import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentCards from "../components/dashboard/AppointmentCards";
import { useAuth } from "../provider/AuthProvider";
import { getAppointmentsByPatientIdAPI } from "../api/patient";
import { getAppointmentsByDoctorIdAPI } from "../api/doctor";
import { Button } from "@material-tailwind/react";
import ConsultationForm from "../components/consultation/ConsultationForm";

const UserDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full w-full gap-4">
      <DashboardContent userId={user.id} role={role} />
      <SidebarPlaceholder />
    </div>
  );
};

const DashboardContent = ({ userId, role }) => (
  <div className="flex h-full w-full flex-col rounded-xl 2xl:w-3/4">
    <Banner />
    <AppointmentCards userId={userId} role={role} />
    <AppointmentsTable userId={userId} role={role} />
  </div>
);

const Banner = () => (
  <div className="h-1/4 w-full">
    <img
      src="./banner-green.jpeg"
      alt="Dashboard Banner"
      className="h-full w-full rounded-xl object-cover object-center"
    />
  </div>
);

const AppointmentsTable = ({ userId, role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let data;
        if (role === "patient") {
          const response = await getAppointmentsByPatientIdAPI(userId, 1, 10);
          data = response.appointments;
        } else if (role === "doctor") {
          const response = await getAppointmentsByDoctorIdAPI(userId, 1, 10);
          data = response.appointments;
        }
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, role]);

  if (loading) {
    return <div className="text-center">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center">No appointments found.</div>;
  }

  return (
    <div className="max-h-2/4 flex h-2/4 flex-col gap-4 overflow-y-auto">
      {selectedAppointment && (
        <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add Consultation</h2>
            <Button
              variant="text"
              onClick={() => setSelectedAppointment(null)}
              className="text-red-500"
            >
              Close
            </Button>
          </div>
          <ConsultationForm
            appointmentId={selectedAppointment.id}
            doctorId={selectedAppointment.doctor_id}
            patientId={selectedAppointment.patient_id}
            onSubmit={() => {
              setSelectedAppointment(null);
              // Optional: show success toast or reload appointments
            }}
          />
        </div>
      )}
      <h3 className="text-xl font-medium">Appointments</h3>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            {role === "patient" ? (
              <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
            ) : (
              <th className="border border-gray-300 px-4 py-2 text-left">Patient</th>
            )}
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr
              key={appointment.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(appointment.date_time).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {role === "patient"
                  ? appointment.name || "N/A"
                  : appointment.full_name || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {role === "patient"
                  ? appointment.phone || "N/A"
                  : appointment.phone_number || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2 capitalize">
                {appointment.status || "pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SidebarPlaceholder = () => (
  <div className="hidden h-full w-1/4 rounded-xl bg-[#F5F5F5] 2xl:flex"></div>
);

export default UserDashboard;
