import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./provider/AuthProvider";
import { NotificationProvider } from "./provider/NotificationProvider";
import ProtectedRoute from "./provider/ProtectedRoute";

import Sidebar from "./components/Sidebar";

import BookAppointments from "./pages/BookAppointments";
import MyAppointments from "./pages/MyAppointments";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";

import Signin from "./pages/Register/Signin";
import Signup from "./pages/Register/Signup";
import Unauthorized from "./pages/Register/Unauthorized";
import LandingPage from "./pages/LandingPage";
import { TopNavbar } from "./components/TopNavbar";
import { useState } from "react";
import BookDoctors from "./pages/BookDoctors";

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/book-doctors" element={<BookDoctors />} />
            <Route element={<DashboardLayout />}>
              {dashboardRoutes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute allowedRoles={["patient", "doctor"]}>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              ))}
            </Route>
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Payments />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center gap-4 bg-[#FAFAFA]">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex h-full w-full flex-col gap-4 overflow-hidden overflow-y-scroll px-4">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <Routes>
          {dashboardRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </main>
    </div>
  );
};

const dashboardRoutes = [
  { path: "dashboard", component: UserDashboard },
  { path: "book-appointment", component: BookAppointments },
  { path: "appointments", component: MyAppointments },
  { path: "notifications", component: Notifications },
  { path: "payments", component: Payments },
  { path: "profile", component: Profile },
];

export default App;
