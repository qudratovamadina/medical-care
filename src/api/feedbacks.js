import { supabase } from "../../supabaseClient";

// Insert feedback
export const submitDoctorFeedbackAPI = async ({
  appointment_id,
  doctor_id,
  patient_id,
  rating,
  comment,
}) => {
  const { data, error } = await supabase
    .from("doctor_feedback")
    .insert([
      {
        appointment_id,
        doctor_id,
        patient_id,
        rating,
        comment,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error submitting feedback:", error);
    return null;
  }

  return data;
};

// Utility function to create a user lookup map
const createUserMap = (users, key = "id", value = "user_metadata") =>
  new Map(users.map((user) => [user[key], user[value]]));

// Utility function to fetch all users
const fetchUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data.users || [];
};

// Fetch feedback for a doctor with patient details using user map
export const getDoctorFeedbackWithPatientDetailsAPI = async (doctorId) => {
  const { data: feedbacks, error: feedbackError } = await supabase
    .from("doctor_feedback")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (feedbackError) {
    console.error("Error fetching doctor feedback:", feedbackError);
    return [];
  }

  const users = await fetchUsers();
  const userMap = createUserMap(users, "id", "user_metadata");

  const feedbacksWithPatientDetails = feedbacks.map((feedback) => {
    const patient = userMap.get(feedback.patient_id) || null;
    return { ...feedback, patient };
  });

  return feedbacksWithPatientDetails;
};
// Optional: Fetch feedback for a specific appointment (to prevent duplicate submission)
export const getFeedbackByAppointmentIdAPI = async (appointmentId) => {
  const { data, error } = await supabase
    .from("doctor_feedback")
    .select("*")
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching feedback for appointment:", error);
    return null;
  }

  return data;
};
