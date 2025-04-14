import React, { useEffect, useState } from "react";
import { TopNavbar } from "../components/TopNavbar";
import { Dropdown } from "../components/Dropdown";
import { getDoctorsAPI } from "../api/patient";
import { useAuth } from "../provider/AuthProvider";
import { DoctorCard } from "../components/booking/DoctorCard";

const BookAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsAPI();
        setDoctors(response);
        setFilteredDoctors(response); // Initialize filteredDoctors with all doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleFilter = (specialty) => {
    if (specialty) {
      setFilteredDoctors(
        doctors.filter(
          (doctor) => doctor.user_metadata.specialty === specialty,
        ),
      );
    } else {
      setFilteredDoctors(doctors); // Reset to all doctors if no filter is applied
    }
  };

  return (
    <>
      <div className="flex w-full items-end justify-end gap-2">
        <Dropdown
          specialties={[
            ...new Set(doctors.map((doctor) => doctor.user_metadata.specialty)),
          ]}
          onSelect={handleFilter}
        />
      </div>
      <div className="grid h-fit w-full grid-cols-1 gap-4 overflow-hidden overflow-y-scroll pb-4 md:grid-cols-3 2xl:grid-cols-4">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            patientId={user.id}
            patientName={user.user_metadata.name}
            name={doctor.user_metadata.name}
            profileIMG={doctor.user_metadata?.profile_img}
            specialty={doctor.user_metadata.specialty}
          />
        ))}
      </div>
    </>
  );
};

export default BookAppointments;
