"use client";
import React, { useState } from "react";
import {
  UploadIcon,
  FileTextIcon,
  FileIcon,
  XIcon,
  CheckCircleIcon,
} from "lucide-react";

const DocumentsPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    setUploadedFiles((prev) => [...prev, ...validFiles]);
    // Simulate upload progress
    validFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Show success modal when all files are uploaded
          if (Object.values(uploadProgress).every((p) => p === 100)) {
            setTimeout(() => setShowSuccessModal(true), 500);
          }
        }
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: progress,
        }));
      }, 300);
    });
  };
  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadProgress((prev) => {
      const updated = {
        ...prev,
      };
      delete updated[fileName];
      return updated;
    });
  };
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
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
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Study Materials
      </h1>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
        <h2 className="text-lg font-medium text-gray-800 mb-1">
          Drag and drop your files here
        </h2>
        <p className="text-gray-600 mb-4">
          Supported file types: PDF, DOCX, PPT
        </p>
        <label className="inline-block">
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.ppt,.pptx"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block">
            Browse Files
          </span>
        </label>
      </div>
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Uploaded Files
          </h3>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center border border-gray-200 rounded-lg p-3"
              >
                <div className="mr-3">{getFileIcon(file.name)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{
                        width: `${uploadProgress[file.name] || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="ml-3 p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your files have been successfully uploaded and are being
                processed by our AI.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DocumentsPage;
