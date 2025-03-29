import React from "react";
import { TopNavbar } from "../components/TopNavbar";
import { TransactionsTable } from "../components/TransactionsTable";
import AppointmentCards from "../components/dashboard/AppointmentCards";
import { useAuth } from "../provider/AuthProvider";

const UserDashboard = () => {
  const { user, role } = useAuth();

  return (
    <div className="flex h-full w-full gap-4">
      <DashboardContent userId={user.id} role={role} />
      <SidebarPlaceholder />
    </div>
  );
};

const DashboardContent = ({ userId, role }) => (
  <div className="flex h-full w-full flex-col rounded-xl lg:w-3/4">
    <Banner />
    <AppointmentCards userId={userId} role={role} />
    <TransactionsSection userId={userId} role={role} />
  </div>
);

const Banner = () => (
  <div className="h-1/4 w-full">
    <img
      src="./banner-green.jpeg"
      alt="Dashboard Banner"
      className="h-full w-full rounded-xl object-cover object-center"
    />
  </div>
);

const TransactionsSection = ({ userId, role }) => (
  <div className="max-h-2/4 flex h-2/4 flex-col gap-4">
    <h3 className="text-xl font-medium">Transactions</h3>
    <TransactionsTable userId={userId} role={role} />
  </div>
);

const SidebarPlaceholder = () => (
  <div className="hidden h-full w-1/4 rounded-xl bg-[#F5F5F5] lg:flex"></div>
);

export default UserDashboard;
