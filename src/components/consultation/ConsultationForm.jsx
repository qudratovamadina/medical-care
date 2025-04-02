import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { createConsultationAPI } from "../../api/consultations";

const ConsultationForm = ({ appointmentId, doctorId, patientId, onSubmit }) => {
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [visibility, setVisibility] = useState("both");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    setUploading(true);
    const uploadedFiles = [];

    for (const file of files) {
      const filePath = `${appointmentId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("consultation-attachments")
        .upload(filePath, file);

      if (error) {
        console.error("File upload error:", error);
        continue;
      }

      const { publicUrl } = supabase.storage
        .from("consultation-attachments")
        .getPublicUrl(filePath).data;

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
      });
    }

    setUploading(false);
    return uploadedFiles;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attachments = await uploadFiles();

    const newConsultation = await createConsultationAPI({
      appointmentId,
      doctorId,
      patientId,
      notes,
      attachments,
      visibility,
    });

    if (newConsultation && onSubmit) {
      onSubmit(newConsultation);
      setNotes("");
      setFiles([]);
      setVisibility("both");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg bg-white p-6 shadow-md"
    >
      <textarea
        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Write consultation notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Attach Files
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visibility
        </label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="both">Visible to both</option>
          <option value="doctor">Only doctor</option>
          <option value="patient">Only patient</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={uploading}
        className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
          uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        {uploading ? "Uploading..." : "Submit Consultation"}
      </button>
    </form>
  );
};

export default ConsultationForm;