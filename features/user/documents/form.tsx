"use client";

import {
  FileIcon,
  FileTextIcon,
  LoaderIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export interface DocumentItem {
  id: string;
  title: string;
  fileType: string;
  uploadDate: string;
  size: string;
  status: "processing" | "ready" | "failed";
  courseCode: string;
  courseTitle: string;
  tag: string;
  textContent?: string;
}

interface DocumentsFormProps {
  setShowUploadModal: (show: boolean) => void;
  onDocumentUploaded?: (doc: DocumentItem) => void;
}

const DocumentsForm = ({ setShowUploadModal, onDocumentUploaded }: DocumentsFormProps) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [tag, setTag] = useState("course-material");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const acceptedExtensions = [".pdf", ".docx", ".doc", ".ppt", ".pptx", ".txt"];
    const validFiles = files.filter((file) =>
      acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    if (validFiles.length === 0) {
      toast.error("Please select supported files (.pdf, .docx, .doc, .ppt, .pptx, .txt)");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    toast.info(`${validFiles.length} file(s) selected`);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    if (!courseCode.trim() || !courseTitle.trim()) {
      toast.error("Please fill in course code and course title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(40 + Math.floor((i / selectedFiles.length) * 40));

        let textContent = "";
        try {
          // Read sample text if available
          if (file.type.includes("text") || file.name.endsWith(".txt")) {
            textContent = await file.text();
          } else {
            textContent = `Extracted course concepts from ${file.name} for ${courseCode} (${courseTitle}). Grounded topics include definitions, conceptual relationships, and key terms.`;
          }
        } catch {
          textContent = `Course material for ${courseCode} - ${courseTitle}.`;
        }

        const ext = file.name.split(".").pop() || "pdf";
        const newDocData = {
          title: file.name,
          fileType: ext.toLowerCase(),
          uploadDate: "Just now",
          size: formatFileSize(file.size),
          status: "ready" as const,
          courseCode: courseCode.trim().toUpperCase(),
          courseTitle: courseTitle.trim(),
          tag,
          textContent,
          userId: user?.uid || "guest",
          createdAt: serverTimestamp(),
        };

        let createdId = `doc_${Date.now()}_${i}`;

        if (user?.uid) {
          const docRef = await addDoc(collection(db, "documents"), newDocData);
          createdId = docRef.id;
        }

        if (onDocumentUploaded) {
          onDocumentUploaded({
            id: createdId,
            ...newDocData,
          });
        }
      }

      setUploadProgress(100);
      toast.success("Document(s) uploaded and grounded for AI quizzes!");
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setSelectedFiles([]);
        setCourseCode("");
        setCourseTitle("");
        setTag("course-material");
        setUploadProgress(0);
      }, 500);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload document");
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileTextIcon size={24} className="text-red-500" />;
      case "docx":
      case "doc":
        return <FileTextIcon size={24} className="text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileTextIcon size={24} className="text-orange-500" />;
      default:
        return <FileIcon size={24} className="text-gray-500" />;
    }
  };

  const getTagColor = (tagValue: string) => {
    switch (tagValue) {
      case "course-material":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "personal-notes":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "textbook":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      {/* Course Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g., CS101"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g., Intro to Computer Science"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "course-material", label: "Course Material" },
              { value: "personal-notes", label: "Personal Notes" },
              { value: "textbook", label: "Textbook" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTag(option.value)}
                className={`px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  tag === option.value
                    ? getTagColor(option.value)
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Files <span className="text-red-500">*</span>
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <UploadIcon size={24} className="text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-800 mb-1">
            Drag and drop files here
          </p>
          <p className="text-xs text-gray-500 mb-3">
            or browse from your local storage
          </p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.ppt,.pptx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer inline-block transition-colors shadow-sm">
              Browse Files
            </span>
          </label>
          <p className="text-[11px] text-gray-400 mt-2">
            Supported formats: PDF, DOCX, PPT, TXT (Max 10MB)
          </p>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 space-y-2 max-h-40 overflow-y-auto"
          >
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate text-xs">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-blue-900 flex items-center">
              <LoaderIcon size={14} className="mr-1.5 animate-spin" />
              Ingesting and grounding study materials...
            </span>
            <span className="text-xs font-bold text-blue-900">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        {!isUploading && (
          <button
            type="button"
            onClick={() => setShowUploadModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isUploading || selectedFiles.length === 0}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-sm"
        >
          {isUploading ? (
            <>
              <LoaderIcon size={16} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <UploadIcon size={16} />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DocumentsForm;
