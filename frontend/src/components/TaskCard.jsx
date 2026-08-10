import { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import supabase from "../api/supabase";

function TaskCard({ task, index }) {
  const [file, setFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchAttachments = async () => {
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("task_id", task.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch attachments error:", error);
      return;
    }

    setAttachments(data || []);
  };

  useEffect(() => {
    fetchAttachments();
  }, [task.id]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      setUploading(true);

      const filePath = `${task.id}/${Date.now()}-${file.name}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("task-attachments")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Save attachment information in database
      const { error: dbError } = await supabase
        .from("attachments")
        .insert([
          {
            task_id: task.id,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
          },
        ]);

      if (dbError) {
        throw dbError;
      }

      setFile(null);

      // Reset file input
      document.getElementById(`file-${task.id}`).value = "";

      await fetchAttachments();

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow p-3 mb-3"
        >
          <h3 className="font-semibold">{task.title}</h3>

          <p className="text-gray-500 text-sm mb-3">
            {task.description}
          </p>

          {/* Attachment Upload */}
          <div className="border-t pt-3">
            <input
              id={`file-${task.id}`}
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm w-full"
            />

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Attachment"}
            </button>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-sm mb-1">
                Attachments
              </p>

              {attachments.map((attachment) => (
                <AttachmentLink
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

function AttachmentLink({ attachment }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getUrl = async () => {
      const { data, error } = await supabase.storage
        .from("task-attachments")
        .createSignedUrl(attachment.file_path, 3600);

      if (error) {
        console.error("Signed URL error:", error);
        return;
      }

      setUrl(data?.signedUrl || "");
    };

    getUrl();
  }, [attachment.file_path]);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block text-blue-600 text-sm hover:underline"
    >
      📎 {attachment.file_name}
    </a>
  );
}

export default TaskCard;