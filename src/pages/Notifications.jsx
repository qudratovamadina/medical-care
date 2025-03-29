import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { TopNavbar } from "../components/TopNavbar";
import { getNotificationsByCurrentUserAPI } from "../api/patient";
import { useAuth } from "../provider/AuthProvider";
import { useNotifications } from "../provider/NotificationProvider";
import { NavLink } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const { notifications: liveNotifications } = useNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificationsByCurrentUserAPI(user.id);
        setNotifications(sortByDate(response));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (liveNotifications.length > 0) {
      const newNotifications = liveNotifications.map((notif) => ({
        ...notif,
        new: true,
      }));
      setNotifications((prev) => [...newNotifications, ...prev]);

      const timer = setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, new: false })),
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [liveNotifications]);

  const sortByDate = (notifications) =>
    notifications.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden overflow-y-scroll">
      <Card
        shadow={false}
        className="h-full w-full rounded-lg border border-gray-300 bg-white"
      >
        <CardBody className="flex h-full flex-col gap-4">
          <Typography variant="h5" color="blue-gray" className="font-bold">
            Notifications
          </Typography>
          <NotificationList
            notifications={notifications}
            formatDate={formatDate}
          />
        </CardBody>
      </Card>
    </div>
  );
};

const NotificationList = ({ notifications, formatDate }) => (
  <div className="flex flex-col overflow-y-auto">
    {notifications.map((notification, index) => (
      <NotificationItem
        key={index}
        notification={notification}
        formatDate={formatDate}
      />
    ))}
  </div>
);

const NotificationItem = ({ notification, formatDate }) => (
  <NavLink
    to="/appointments"
    className={`flex flex-col gap-2 border-b p-4 transition-all duration-300 hover:bg-blue-gray-50 ${
      notification.new ? "bg-yellow-100" : "bg-white"
    }`}
  >
    <Typography variant="h6" color="blue-gray" className="font-normal">
      {notification.message}
    </Typography>
    <div className="flex items-center justify-between">
      <Typography variant="small" color="blue-gray" className="font-normal">
        {formatDate(notification.created_at)}
      </Typography>
      <Chip
        variant="ghost"
        size="sm"
        value={notification.status}
        color={
          notification.status === "confirmed"
            ? "green"
            : notification.status === "pending"
              ? "yellow"
              : "blue-gray"
        }
      />
    </div>
  </NavLink>
);

export default Notifications;
