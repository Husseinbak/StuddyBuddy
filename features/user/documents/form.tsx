import {
  FileIcon,
  FileTextIcon,
  LoaderIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface DocumentsFormProps {
  setShowUploadModal: (show: boolean) => void;
}

const DocumentsForm = ({ setShowUploadModal }: DocumentsFormProps) => {
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
    const acceptedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    const validFiles = files.filter((file) =>
      acceptedTypes.includes(file.type)
    );
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }
    if (!courseCode || !courseTitle) {
      alert("Please fill in all required fields");
      return;
    }
    setIsUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        setShowUploadModal(false);
        // Reset form
        setSelectedFiles([]);
        setCourseCode("");
        setCourseTitle("");
        setTag("course-material");
        setUploadProgress(0);
      } else {
        setUploadProgress(progress);
      }
    }, 300);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
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
    <form onSubmit={handleUpload}>
      {/* File Upload Area */}
      {/* Course Information */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g., CS101"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g., Intro to CS"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                value: "course-material",
                label: "Course Material",
              },
              {
                value: "personal-notes",
                label: "Personal Notes",
              },
              {
                value: "textbook",
                label: "Textbook",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTag(option.value)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  tag === option.value
                    ? getTagColor(option.value)
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Files <span className="text-red-500">*</span>
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UploadIcon size={28} className="text-blue-600" />
          </div>
          <p className="text-base font-medium text-gray-800 mb-2">
            Drag and drop files here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse from your computer
          </p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.ppt,.pptx"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block transition-colors">
              Browse Files
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-3">
            Supported formats: PDF, DOCX, PPT (Max 10MB)
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="mt-4 space-y-2"
          >
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: 1,
            height: "auto",
          }}
          className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Uploading and processing...
            </span>
            <span className="text-sm font-bold text-blue-900">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${uploadProgress}%`,
              }}
              transition={{
                duration: 0.3,
              }}
              className="h-2 bg-blue-600 rounded-full"
            />
          </div>
          <p className="text-xs text-blue-700 mt-2">
            AI is analyzing your document for optimal learning...
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3">
        {!isUploading && (
          <button
            type="button"
            onClick={() => setShowUploadModal(false)}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <motion.button
          whileHover={{
            scale: isUploading ? 1 : 1.02,
          }}
          whileTap={{
            scale: isUploading ? 1 : 0.98,
          }}
          type="submit"
          disabled={isUploading || selectedFiles.length === 0}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isUploading ? (
            <>
              <LoaderIcon size={18} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadIcon size={18} />
              <span>Upload</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default DocumentsForm;
