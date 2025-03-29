import {
  Bell,
  ChevronDown,
  Menu as MenuIcon,
  Search,
  Settings,
} from "lucide-react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useAuth } from "../provider/AuthProvider";
import { useNotifications } from "../provider/NotificationProvider";
import { doctorIMG, patientIMG } from "./utils/constants";
import { signOutAPI } from "../api/auth";
import { NavLink, useNavigate } from "react-router-dom";

export function TopNavbar({ toggleSidebar }) {
  const { user, role } = useAuth();
  const { name, profile_img, specialty } = user.user_metadata;
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutAPI();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="flex w-full items-center justify-between py-4">
      <SearchBar />
      <div className="flex flex-row-reverse items-center gap-6 lg:flex-row">
        {role === "doctor" && (
          <NavLink to="/profile">
            <Settings size={24} />
          </NavLink>
        )}
        <NotificationBell notifications={notifications} />
        <UserProfile
          name={name}
          profileImg={
            profile_img || (role === "doctor" ? doctorIMG : patientIMG)
          }
          specialty={specialty}
          onLogout={handleLogout}
        />
      </div>
      <MenuIcon
        onClick={toggleSidebar}
        size={28}
        className="hover:rounded hover:bg-blue-300 hover:p-1 lg:hidden"
      />
    </nav>
  );
}

const SearchBar = () => (
  <div className="invisible hidden w-2/5 items-center gap-2 rounded-xl bg-[#EBEEF3] pl-4 lg:flex">
    <Search size={16} />
    <input
      type="text"
      className="w-full bg-transparent p-2 text-sm font-light text-gray-500 outline-none"
      placeholder="Search"
    />
  </div>
);

const NotificationBell = ({ notifications }) => (
  <Menu>
    <MenuHandler>
      <div className="relative cursor-pointer">
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {notifications.length}
          </span>
        )}
      </div>
    </MenuHandler>
    <MenuList>
      {notifications.length === 0 ? (
        <MenuItem className="text-sm text-gray-500">
          No new notifications
        </MenuItem>
      ) : (
        notifications.map((notif, index) => (
          <NavLink to="/notifications" key={index} className="text-sm">
            {notif.message}
          </NavLink>
        ))
      )}
    </MenuList>
  </Menu>
);

const UserProfile = ({ name, profileImg, specialty, onLogout }) => (
  <Menu>
    <MenuHandler>
      <div className="flex cursor-pointer items-center gap-2">
        <span className="h-9 w-9 overflow-hidden rounded-full border">
          <img
            src={profileImg}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </span>
        <div className="flex flex-col">
          <p className="font-medium tracking-wide text-gray-900">{name}</p>
          <span className="text-xs font-normal italic tracking-wide text-gray-700">
            {specialty}
          </span>
        </div>
        <ChevronDown size={24} />
      </div>
    </MenuHandler>
    <MenuList>
      <MenuItem onClick={onLogout}>Log Out</MenuItem>
    </MenuList>
  </Menu>
);
