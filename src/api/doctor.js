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

// Utility function to fetch all users
const fetchUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data.users || [];
};

// Utility function to create a user lookup map
const createUserMap = (users, key = "id", value = "user_metadata") =>
  new Map(users.map((user) => [user[key], user[value]]));

export const getAppointmentsByDoctorIdAPI = async (
  doctorId,
  page = 1,
  limit = 10,
) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .range(from, to);

  if (appointmentsError || !appointments?.length) {
    console.error("Error fetching appointments:", appointmentsError);
    return { appointments: [], totalPages: 0 };
  }

  const { count, error: countError } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("doctor_id", doctorId);

  if (countError) {
    console.error("Error fetching total count:", countError);
    return { appointments, totalPages: 1 };
  }

  const users = await fetchUsers();
  const userMap = createUserMap(users, "email");

  const mergedAppointments = appointments.map((appointment) => ({
    ...appointment,
    profile_img: userMap.get(appointment?.email)?.profile_img || "", // Set blank if user not found
    full_name: userMap.get(appointment?.email)?.name || appointment.full_name, // Set blank if user not found
    phone: userMap.get(appointment?.email)?.phone || appointment.phone_number, // Set blank if user not found
  }));

  return {
    appointments: mergedAppointments,
    totalPages: Math.ceil(count / limit),
  };
};

// Fetch notifications for the current user
export const getNotificationsByCurrentUserAPI = async (userId) => {
  if (!userId) {
    console.error("No user is currently logged in.");
    return [];
  }
  return await fetchFromSupabase("notifications", [["user_id", userId]]);
};

// Confirm an appointment with updated status and time
export const confirmAppointmentAPI = async ({ appointmentId, dateTime }) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "confirmed", date_time: dateTime })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) {
    console.error("Error confirming appointment:", error);
    return null;
  }

  return data;
};

// Fetch payments with patient names
export const getPaymentsByDoctorIdAPI = async (doctorId) => {
  const payments = await fetchFromSupabase("payments", [
    ["doctor_id", doctorId],
  ]);
  if (!payments.length) return [];

  const users = await fetchUsers();
  const userMap = createUserMap(users, "id", "user_metadata");

  return payments.map((payment) => ({
    ...payment,
    name: userMap.get(payment.patient_id).name || "Unknown",
  }));
};

// Fetch latest payments for a doctor
export const getLatestPaymentsByDoctorIdAPI = async (doctorId) => {
  const latestPayments = await fetchFromSupabase(
    "payments",
    [["doctor_id", doctorId]],
    { order: { column: "created_at", ascending: false }, limit: 10 },
  );

  if (!latestPayments.length) return [];

  const users = await fetchUsers();
  const userMap = createUserMap(users, "id", "user_metadata.name");

  return latestPayments.map((payment) => ({
    ...payment,
    name: userMap.get(payment.patient_id) || "Unknown",
  }));
};
