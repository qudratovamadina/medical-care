import { supabase } from "../../supabaseClient";

// Utility function for Supabase queries
const fetchFromSupabase = async (table, filters = [], options = {}) => {
  let query = supabase.from(table).select("*");

  filters.forEach(([key, value]) => (query = query.eq(key, value)));

  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending,
    });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching from ${table}:`, error);
    return [];
  }
  return data || [];
};

// Utility function to fetch users from Supabase
const fetchUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data.users || [];
};

// Fetch all doctors
export const getDoctorsAPI = async () => {
  const users = await fetchUsers();
  return users.filter((user) => user.user_metadata.role === "doctor");
};

// Create an appointment
export const createAppointmentAPI = async (appointmentData) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointmentData])
    .select()
    .single();

  if (error) {
    console.error("Error creating appointment:", error);
    return null;
  }
  return data;
};

// Fetch appointments for a patient with pagination
export const getAppointmentsByPatientIdAPI = async (
  patientId,
  page = 1,
  limit = 10,
) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .range(from, to);

  if (error || !appointments?.length) {
    console.error("Error fetching appointments:", error);
    return { appointments: [], totalPages: 1 };
  }

  const users = await fetchUsers();
  const doctorMap = new Map(users.map((user) => [user.id, user.user_metadata]));

  const { count } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId);

  const totalPages = Math.ceil(count / limit);

  return {
    appointments: appointments.map((appointment) => ({
      ...appointment,
      ...doctorMap.get(appointment.doctor_id),
      status: appointment.status,
    })),
    totalPages,
  };
};

// Fetch notifications for the current user
export const getNotificationsByCurrentUserAPI = async (userId) => {
  if (!userId) return [];
  return await fetchFromSupabase("notifications", [["user_id", userId]]);
};

// Create a notification
export const createNotificationAPI = async (userId, message, status) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, message, status }])
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return null;
  }
  return data;
};