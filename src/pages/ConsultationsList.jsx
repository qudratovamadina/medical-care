import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Input,
} from "@material-tailwind/react";
import {
  getAppointmentByIdAPI,
  getConsultationsByDoctorIdAPI,
  getConsultationsByPatientIdAPI,
} from "../api/consultations";
import { useAuth } from "../provider/AuthProvider";
import { getUserByIdAPI } from "../api/auth";
import { ConsultationModal } from "../components/consultation/ConsultationModal";

export default function ConsultationsList() {
  const { user, role } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    userInfo: null,
    appointmentInfo: null,
  });

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user?.id) return;

      let data = [];
      if (role === "doctor") {
        data = await getConsultationsByDoctorIdAPI(user.id);
      } else if (role === "patient") {
        data = await getConsultationsByPatientIdAPI(user.id);
      }

      setConsultations(data);
    };

    fetchConsultations();
  }, [user, role]);

  const filtered = consultations.filter((c) =>
    c.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader
          shadow={false}
          floated={false}
          className="flex flex-col items-start justify-between gap-4 md:flex-row"
        >
          <div>
            <Typography variant="h5" color="blue-gray">
              Consultations
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View and manage all consultation records
            </Typography>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 p-4">
                  {role === "doctor" ? "Patient ID" : "Doctor ID"}
                </th>
                <th className="border-b border-blue-gray-100 p-4">
                  Appointment
                </th>
                <th className="border-b border-blue-gray-100 p-4">
                  Visibility
                </th>
                <th className="border-b border-blue-gray-100 p-4">
                  Created At
                </th>
                <th className="border-b border-blue-gray-100 p-4">Notes</th>
                <th className="border-b border-blue-gray-100 p-4">
                  Attachments
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer border-b hover:bg-blue-gray-50"
                  onClick={async () => {
                    const userIdToFetch =
                      role === "doctor" ? c.patient_id : c.doctor_id;
                    const userInfo = await getUserByIdAPI(userIdToFetch);
                    const appointmentInfo = await getAppointmentByIdAPI(
                      c.appointment_id,
                    );
                    setSelectedConsultation(c);
                    setModalData({ userInfo, appointmentInfo });
                    setModalOpen(true);
                  }}
                >
                  <td className="p-4">
                    {role === "doctor" ? c.patient_id : c.doctor_id}
                  </td>
                  <td className="p-4">{c.appointment_id}</td>
                  <td className="p-4">
                    <Chip
                      value={c.visibility}
                      color={
                        c.visibility === "both"
                          ? "green"
                          : c.visibility === "doctor"
                            ? "blue"
                            : "amber"
                      }
                      size="sm"
                    />
                  </td>
                  <td className="p-4">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                  <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap p-4">
                    {c.notes}
                  </td>
                  <td className="p-4">
                    {c.attachments?.length ? (
                      <ul className="space-y-1">
                        {c.attachments.map((file, index) => (
                          <li key={index}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 underline"
                            >
                              {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No attachments
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No consultations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <ConsultationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        consultation={selectedConsultation}
        role={role}
        userInfo={modalData.userInfo}
        appointmentInfo={modalData.appointmentInfo}
      />
    </>
  );
}
