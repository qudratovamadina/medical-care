import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  BellIcon,
  CreditCardIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { signOutAPI } from "../api/auth";
import { User2Icon } from "lucide-react";
import { useNotifications } from "../provider/NotificationProvider";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { user, role } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOutAPI();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <PresentationChartBarIcon className="h-8 w-8" />,
    },
    ...(role === "patient"
      ? [
          {
            to: "/book-appointment",
            label: "Book Appointment",
            icon: <CalendarIcon className="h-8 w-8" />,
          },
        ]
      : []),
    {
      to: "/appointments",
      label: "My Appointments",
      icon: <ClipboardDocumentIcon className="h-8 w-8" />,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: <BellIcon className="h-8 w-8" />,
      suffix: notifications.length > 0 && (
        <Chip
          value={notifications.length}
          size="sm"
          variant="ghost"
          color="blue-gray"
          className="rounded-full"
        />
      ),
    },
    {
      to: "/payments",
      label: "Payments",
      icon: <CreditCardIcon className="h-8 w-8" />,
    },
    ...(role === "doctor"
      ? [
          {
            to: "/profile",
            label: "Profile",
            icon: <User2Icon className="h-8 w-8" />,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform bg-[#858C9C] shadow-xl transition-transform lg:static lg:h-full lg:transform-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Card className="h-full w-64 min-w-fit bg-[#858C9C] p-4 shadow-none">
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray" className="text-white">
            Sidebar
          </Typography>
          <button
            className="text-white lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>
        <List className="text-lg text-white">
          {menuItems.map(({ to, label, icon, suffix }) => (
            <NavLink key={to} to={to}>
              <ListItem className={isActive(to) ? "bg-[#A4B1C7]" : ""}>
                <ListItemPrefix>{icon}</ListItemPrefix>
                {label}
                {suffix && <ListItemSuffix>{suffix}</ListItemSuffix>}
              </ListItem>
            </NavLink>
          ))}
          <ListItem onClick={handleLogout} className="mt-auto">
            <ListItemPrefix>
              <PowerIcon className="h-8 w-8" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    </div>
  );
}

export default Sidebar;
