import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "./AuthProvider";
import { LifeLine } from "react-loading-indicators";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, loading } = useAuth();
  const notificationSound = new Audio("./sounds/notification.mp3");

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          notificationSound
            .play()
            .catch((err) => console.error("Sound error:", err));
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LifeLine color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
