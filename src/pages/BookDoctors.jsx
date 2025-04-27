import React, { useEffect, useState } from "react";
import { Dropdown } from "../components/Dropdown";
import { getAppointmentsByPatientIdAPI, getDoctorsAPI } from "../api/patient";
import { useAuth } from "../provider/AuthProvider";
import { DoctorCard } from "../components/booking/DoctorCard";
import Footer from "../components/landing/Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";

const BookDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsAPI();
        setDoctors(response);
        setFilteredDoctors(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user && user.id) {
          const response = await getAppointmentsByPatientIdAPI(user.id, 1, 100);
          setAppointments(response?.appointments || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleFilter = (specialty) => {
    let filtered = doctors;
    if (specialty) {
      filtered = filtered.filter(
        (doctor) => doctor.user_metadata.specialty === specialty,
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((doctor) =>
        doctor.user_metadata.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredDoctors(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    handleFilter(null); // Reapply filters with the updated search query
  };

  const handleBooking = (doctorId) => {
    if (!user) {
      navigate("/login"); // Redirect guests to login or a guest booking form
    } else {
      navigate(`/book/${doctorId}`); // Proceed with booking for logged-in users
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center ">
      <Navbar />
      <div className="flex w-full justify-center bg-gray-100">
        <div className="container flex h-dvh flex-col gap-12 rounded-lg p-6">
          <div className="flex w-full flex-col items-end justify-between gap-4 2xl:flex-row 2xl:items-center">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
            <Dropdown
              specialties={[
                ...new Set(
                  doctors.map((doctor) => doctor.user_metadata.specialty),
                ),
              ]}
              onSelect={handleFilter}
            />
          </div>
          <div className="grid h-fit w-full grid-cols-1 gap-4 overflow-hidden overflow-y-scroll pb-4 lg:grid-cols-2 2xl:grid-cols-4">
            {filteredDoctors.map((doctor) => {
              const isAlreadyBooked = appointments.some(
                (appointment) =>
                  appointment.email == doctor.user_metadata.email,
              );

              return (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.user_metadata.name}
                  profileIMG={doctor.user_metadata?.profile_img}
                  specialty={doctor.user_metadata.specialty}
                  disabled={isAlreadyBooked}
                  buttonText={isAlreadyBooked ? "Already Booked" : "Book"}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDoctors;
