import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { patientIMG } from "../utils/constants";

export function ConsultationModal({
  open,
  onClose,
  consultation,
  role,
  userInfo,
  appointmentInfo,
}) {
  if (!consultation || !userInfo || !appointmentInfo) return null;

  const { notes, created_at, visibility, attachments, appointment_id } =
    consultation;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="rounded-lg">
      <DialogHeader className="text-lg font-semibold text-gray-900">
        Consultation Details
      </DialogHeader>
      <DialogBody className="space-y-6 bg-gray-50 p-6">
        <div className="flex items-center gap-6">
          <Avatar
            src={userInfo?.user?.user_metadata.profile_img || patientIMG}
            alt={userInfo?.user?.user_metadata.name}
            size="lg"
            className="border border-gray-300"
          />
          <div>
            <Typography variant="h6" className="text-gray-900">
              {userInfo?.user?.user_metadata.name}
            </Typography>
            <Typography variant="small" color="gray" className="text-sm">
              {userInfo?.user?.user_metadata.email}
            </Typography>
            <Typography variant="small" color="gray" className="text-sm">
              {userInfo?.user?.user_metadata.phone}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="gray" className="text-sm">
              Appointment ID
            </Typography>
            <Typography className="text-gray-900">{appointment_id}</Typography>
          </div>
          <div>
            <Typography variant="small" color="gray" className="text-sm">
              Created At
            </Typography>
            <Typography className="text-gray-900">
              {new Date(created_at).toLocaleString()}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="gray" className="text-sm">
              Appointment Time
            </Typography>
            <Typography className="text-gray-900">
              {new Date(appointmentInfo.date_time).toLocaleString()}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="gray" className="text-sm">
              Appointment Status
            </Typography>
            <Typography className="capitalize text-gray-900">
              {appointmentInfo.status}
            </Typography>
          </div>
        </div>

        <div>
          <Typography variant="small" color="gray" className="text-sm">
            Visibility
          </Typography>
          <Typography className="capitalize text-gray-900">
            {visibility}
          </Typography>
        </div>

        <div>
          <Typography variant="small" color="gray" className="text-sm">
            Notes
          </Typography>
          <Typography className="whitespace-pre-wrap text-gray-900">
            {notes}
          </Typography>
        </div>

        {attachments?.length > 0 && (
          <div>
            <Typography variant="small" color="gray" className="text-sm">
              Attachments
            </Typography>
            <ul className="list-disc space-y-1 pl-4">
              {attachments.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="bg-gray-100 p-4">
        <Button
          variant="text"
          onClick={onClose}
          className="text-blue-600 hover:bg-blue-50"
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
