import { supabase } from "./supabaseClient";

const userId = "USER_ID_HERE"; // Get this from authentication

const subscribeToNotifications = () => {
  supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        // console.log("New Notification:", payload.new);
        // Here, you can update UI, show a toast, or send a real-time alert
      },
    )
    .subscribe();
};

subscribeToNotifications();
