import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
} from "@material-tailwind/react";
import { useAuth } from "../../provider/AuthProvider";
import { patientIMG } from "../utils/constants";
import { getAppointmentsByDoctorIdAPI } from "../../api/doctor";
import { HandleBookingModal } from "../utils/HandleBookingModal";
import ConsultationForm from "../consultation/ConsultationForm";

const TABS = ["all", "confirmed", "pending", "completed", "cancelled"];
const TABLE_HEAD = [
  "#",
  "Name",
  "Email",
  "Phone Number",
  "Date & Time",
  "Status",
  "Payment Status",
  "",
];

const ITEMS_PER_PAGE = 10;

export function PatientsList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { appointments, totalPages } = await getAppointmentsByDoctorIdAPI(
          user.id,
          currentPage,
          ITEMS_PER_PAGE,
        );
        setAppointments(appointments);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user, currentPage]);

  const filteredAppointments = appointments.filter(
    ({ full_name, status }) =>
      (activeTab === "all" || status === activeTab) &&
      full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="h-full w-full">
      {selectedAppointment && (
        <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add Consultation</h2>
            <Button
              variant="text"
              onClick={() => setSelectedAppointment(null)}
              className="text-red-500"
            >
              Close
            </Button>
          </div>
          <ConsultationForm
            appointmentId={selectedAppointment.id}
            doctorId={selectedAppointment.doctor_id}
            patientId={selectedAppointment.patient_id}
            onSubmit={() => {
              setSelectedAppointment(null);
              // Optional: show success toast or reload appointments
            }}
          />
        </div>
      )}
      <CardHeader
        floated={false}
        shadow={false}
        className="min-h-fit rounded-none"
      >
        <Typography variant="h5" color="blue-gray">
          Appointments
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Manage all your appointments
        </Typography>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={activeTab} className="w-full md:w-max">
            <TabsHeader>
              {TABS.map((tab) => (
                <Tab key={tab} value={tab} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-fit md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden overflow-y-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment, index) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                doctorName={user.user_metadata.name}
                lineNumber={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
              />
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="mt-auto flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const AppointmentRow = ({ appointment, doctorName, onSelect, lineNumber }) => {
  const {
    id,
    profile_img,
    full_name: name,
    email,
    phone, // Added phone number
    date_time,
    status,
    payment_status,
    patient_id,
  } = appointment;

  return (
    <tr
      onClick={onSelect}
      className="cursor-pointer transition-colors hover:bg-blue-gray-50"
    >
      <td className="border-b border-blue-gray-50 p-4 font-medium text-blue-gray-800">
        {lineNumber}
      </td>
      <td className="flex items-center gap-3 border-b border-blue-gray-50 p-4">
        <Avatar src={profile_img || patientIMG} alt={name} size="sm" />
        <Typography variant="small" color="blue-gray" className="font-normal">
          {name}
        </Typography>
      </td>
      <td className="border-b border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {email}
        </Typography>
      </td>
      <td className="border-b border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {phone || "N/A"}{" "}
          {/* Display phone number or "N/A" if not available */}
        </Typography>
      </td>
      <td className="border-b border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {new Date(date_time).toLocaleString()}
        </Typography>
      </td>
      <td className="border-b border-blue-gray-50 p-4">
        <Chip
          variant="ghost"
          size="sm"
          value={status}
          color={status === "confirmed" ? "green" : "blue-gray"}
          className="w-fit"
        />
      </td>
      <td className="border-b border-blue-gray-50 p-4">
        <Chip
          variant="ghost"
          size="sm"
          value={payment_status}
          color={payment_status === "paid" ? "green" : "red"}
          className="w-fit"
        />
      </td>
      {status !== "confirmed" && (
        <td className="border-b border-blue-gray-50 p-4">
          <HandleBookingModal
            patientName={name}
            patientId={patient_id}
            dateTime={date_time}
            status={status}
            appointmentId={id}
            paymentStatus={payment_status}
            doctorName={doctorName}
          />
        </td>
      )}
    </tr>
  );
};
