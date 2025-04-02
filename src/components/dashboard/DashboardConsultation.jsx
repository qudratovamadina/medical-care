import ConsultationForm from "../consultation/ConsultationForm";

const DashboardConsultation = ({ selectedAppointment }) => {
  if (!selectedAppointment) {
    return (
      <div className="hidden h-full w-1/4 items-center justify-center rounded-xl bg-[#F5F5F5] text-gray-500 lg:flex">
        Select an appointment to add consultation
      </div>
    );
  }

  return (
    <div className="hidden h-full w-1/4 overflow-y-auto rounded-xl bg-[#F5F5F5] p-4 lg:flex">
      <ConsultationForm
        appointmentId={selectedAppointment.id}
        doctorId={selectedAppointment.doctor_id}
        patientId={selectedAppointment.patient_id}
        onSubmit={() => {
          // Optional: refresh consultation list or show a success toast
          console.log("Consultation submitted");
        }}
      />
    </div>
  );
};

export default DashboardConsultation;
