import { supabase } from "../../supabaseClient";

export const getUserAPI = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

const updateAppointmentsWithUserId = async (email, userId, role) => {
  const updateField = role === "doctor" ? "doctor_id" : "patient_id";

  const { error } = await supabase
    .from("appointments")
    .update({ [updateField]: userId })
    .eq("email", email);

  if (error) {
    console.error("Error updating appointments:", error);
  }
};

export const signInAPI = async ({ email, password }) => {
  try {
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Update appointments after signing in
    const userId = user?.user?.id;
    const role = user?.user?.user_metadata?.role;

    if (userId && role) {
      await updateAppointmentsWithUserId(email, userId, role);
    }

    return user;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return null;
  }
};

export const signUpAPI = async ({
  email,
  password,
  name,
  phone,
  address,
  dateOfBirth,
  role,
  specialty,
  status,
}) => {
  try {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, address, dateOfBirth, role, specialty, status },
      },
    });

    if (error) {
      throw error;
    }

    // Update appointments after signing up
    const userId = user?.user?.id;
    if (userId) {
      await updateAppointmentsWithUserId(email, userId, role);
    }

    return user;
  } catch (error) {
    console.error("Error during sign-up:", error);
    return null;
  }
};

export const signOutAPI = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

export const updateUserAPI = async (updatedUserData) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: updatedUserData.name,
        profile_img: updatedUserData.profileImg,
        specialty: updatedUserData.specialty,
        status: updatedUserData.status,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
