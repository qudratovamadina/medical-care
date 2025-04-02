import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  submitDoctorFeedbackAPI,
  getFeedbackByAppointmentIdAPI,
} from "../../api/feedbacks";

export default function DoctorFeedbackForm({
  appointmentId,
  doctorId,
  patientId,
  onSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const checkExistingFeedback = async () => {
      const existing = await getFeedbackByAppointmentIdAPI(appointmentId);
      if (existing) {
        setAlreadySubmitted(true);
      }
    };

    if (appointmentId) checkExistingFeedback();
  }, [appointmentId]);

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a star rating.");
    setSubmitting(true);

    const result = await submitDoctorFeedbackAPI({
      appointment_id: appointmentId,
      doctor_id: doctorId,
      patient_id: patientId,
      rating,
      comment,
    });

    setSubmitting(false);
    if (result && onSubmit) onSubmit();
  };

  if (alreadySubmitted) {
    return (
      <Card className="mx-auto max-w-lg shadow-md">
        <CardBody className="space-y-4">
          <Typography variant="h6">
            You&apos;ve already submitted feedback for this appointment. Thank
            you!
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg shadow-md">
      <CardBody className="space-y-4">
        <Typography variant="h6">Rate Your Appointment</Typography>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className={`h-6 w-6 cursor-pointer transition-colors ${
                (hover || rating) >= star ? "text-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <Textarea
          label="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700"
          fullWidth
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardBody>
    </Card>
  );
}
