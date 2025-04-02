import { supabase } from "../../supabaseClient";

// Fetch consultations by appointment ID
export const getConsultationsByAppointmentIdAPI = async (appointmentId) => {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }

  return data;
};

// Create a new consultation
export const createConsultationAPI = async ({
  appointmentId,
  doctorId,
  patientId,
  notes,
  attachments = [],
  visibility = "both",
}) => {
  const { data, error } = await supabase
    .from("consultations")
    .insert([
      {
        appointment_id: appointmentId,
        doctor_id: doctorId,
        patient_id: patientId,
        notes,
        attachments,
        visibility,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating consultation:", error);
    return null;
  }

  return data;
};

// Fetch consultations by doctor ID
export const getConsultationsByDoctorIdAPI = async (doctorId) => {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }

  return data;
};

// Fetch consultations by patient ID
export const getConsultationsByPatientIdAPI = async (patientId) => {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("patient_id", patientId)
    .in("visibility", ["patient", "both"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }

  return data;
};

// Fetch appointment by ID
export const getAppointmentByIdAPI = async (appointmentId) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single();

  if (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }

  return data;
};