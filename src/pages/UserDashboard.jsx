import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentCards from "../components/dashboard/AppointmentCards";
import { useAuth } from "../provider/AuthProvider";
import { getAppointmentsByPatientIdAPI } from "../api/patient";
import { getAppointmentsByDoctorIdAPI } from "../api/doctor";

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
  <div className="flex h-full w-full flex-col rounded-xl lg:w-3/4">
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
      <h3 className="text-xl font-medium">Appointments</h3>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            {role === "patient" ? (
              <th className="border border-gray-300 px-4 py-2 text-left">
                Doctor
              </th>
            ) : (
              <th className="border border-gray-300 px-4 py-2 text-left">
                Patient
              </th>
            )}
            <th className="border border-gray-300 px-4 py-2 text-left">
              Phone
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50">
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
  <div className="hidden h-full w-1/4 rounded-xl bg-[#F5F5F5] lg:flex"></div>
);

export default UserDashboard;
