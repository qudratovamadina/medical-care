import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Stars } from "../dashboard/Stars";
import { BookDoctorModal } from "../utils/BookDoctorModal";

const defaultIMG =
  "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg";

export function DoctorCard({
  id,
  name,
  specialty,
  patientId,
  patientName,
  profileIMG,
}) {
  return (
    <Card className="2xl:w-full">
      <CardHeader floated={false} className="h-[80%] shadow-sm 2xl:max-h-72">
        <img
          src={profileIMG || defaultIMG}
          alt={`${name}'s profile`}
          className="h-full w-full object-cover object-top"
        />
      </CardHeader>
      <CardBody className="py-2 text-center">
        <Typography variant="h5" color="blue-gray">
          {name}
        </Typography>
        <Stars />
        <Typography color="blue-gray" className="text-base capitalize">
          {specialty}
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center pt-0">
        <BookDoctorModal
          doctorId={id}
          patientId={patientId}
          patientName={patientName}
        />
      </CardFooter>
    </Card>
  );
}
