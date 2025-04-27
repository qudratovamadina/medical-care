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
import { getAppointmentsByPatientIdAPI } from "../../api/patient";
import { useAuth } from "../../provider/AuthProvider";
import { doctorIMG } from "../utils/constants";
import { HandleBookingByPatient } from "../utils/HandleBookingByPatient";

const TABS = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Pending", value: "pending" },
];

const TABLE_HEAD = ["Doctor", "Specialty", "Status", "Payment Status", ""];

const DoctorRow = ({ doctor, user }) => (
  <tr>
    <td className="border-b border-blue-gray-50 p-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={doctor.profile_img || doctorIMG}
          alt={doctor.name}
          size="sm"
        />
        <div className="flex flex-col">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {doctor.name}
          </Typography>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal opacity-70"
          >
            {doctor.email}
          </Typography>
        </div>
      </div>
    </td>
    <td className="border-b border-blue-gray-50 p-4 capitalize">
      <Typography variant="small" color="blue-gray" className="font-normal">
        {doctor.specialty}
      </Typography>
    </td>
    <td className="border-b border-blue-gray-50 p-4">
      <Chip
        variant="ghost"
        size="sm"
        value={doctor.status}
        color={doctor.status === "confirmed" ? "green" : "blue-gray"}
        className="w-fit"
      />
    </td>
    <td className="border-b border-blue-gray-50 p-4">
      <Chip
        variant="ghost"
        size="sm"
        value={doctor.payment_status}
        color={doctor.payment_status === "paid" ? "green" : "red"}
        className="w-fit"
      />
    </td>
    <td className="border-b border-blue-gray-50 p-4">
      <HandleBookingByPatient
        patientName={user.user_metadata.name}
        doctorName={doctor.name}
        paymentStatus={doctor.payment_status}
        status={doctor.status}
        appointmentId={doctor.id}
        dateTime={doctor.date_time}
        patientId={user.id}
        doctorId={doctor.doctor_id}
        amount={doctor.amount}
      />
    </td>
  </tr>
);

export function DoctorsList() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAppointmentsByPatientIdAPI(user.id, page, 10);
        setDoctors(response.appointments);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, [user, page]);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      (activeTab === "all" || doctor.status === activeTab) &&
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="flex h-full w-full">
      <CardHeader
        floated={false}
        shadow={false}
        className="min-h-fit rounded-none"
      >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Doctors List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all doctors
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={activeTab} className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                >
                  {label}
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
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <DoctorRow key={doctor.id} doctor={doctor} user={user} />
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="mt-auto flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {page} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
