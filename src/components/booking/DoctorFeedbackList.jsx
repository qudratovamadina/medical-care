import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { getDoctorFeedbackWithPatientDetailsAPI } from "../../api/feedbacks";
import { useAuth } from "../../provider/AuthProvider";
import { patientIMG } from "../utils/constants";

export default function DoctorFeedbackList() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!user?.id) return;

      const enrichedFeedbacks = await getDoctorFeedbackWithPatientDetailsAPI(
        user.id,
      );
      setFeedbacks(enrichedFeedbacks);
    };

    fetchFeedback();
  }, [user]);

  return (
    <Card className="w-full p-6">
      <Typography variant="h5" color="blue-gray" className="mb-4">
        Patient Feedback
      </Typography>
      <CardBody className="space-y-4">
        {feedbacks.length === 0 ? (
          <Typography color="gray">No feedback available yet.</Typography>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="rounded border border-blue-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-3">
                <Avatar
                  src={fb.patient?.profile_img || patientIMG}
                  alt={fb.patient?.name || "Patient"}
                  size="sm"
                  className="border border-gray-300"
                />
                <div className="flex-1">
                  <Typography variant="small" className="font-medium">
                    {fb.patient?.name || "Anonymous"}
                  </Typography>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < fb.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Chip
                  value={new Date(fb.created_at).toLocaleDateString()}
                  size="sm"
                  className="ml-auto bg-gray-100 text-gray-700"
                />
              </div>
              {fb.comment && (
                <Typography className="text-sm text-gray-800">
                  {fb.comment}
                </Typography>
              )}
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
