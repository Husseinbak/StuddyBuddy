"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  FileTextIcon,
  FileIcon,
  CheckCircleIcon,
  DownloadIcon,
  EyeIcon,
  Trash2Icon,
  SearchIcon,
  FilterIcon,
  LoaderIcon,
  AlertCircleIcon,
  FolderIcon,
} from "lucide-react";
import PopUp from "@/components/shared/popup";
import DocumentsForm from "./form";
interface Document {
  id: string;
  title: string;
  fileType: string;
  uploadDate: string;
  size: string;
  status: "processing" | "ready" | "failed";
  courseCode: string;
  courseTitle: string;
  tag: string;
}
const UploadPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  // Mock documents data
  const [documents] = useState<Document[]>([
    {
      id: "1",
      title: "Lecture_Notes_Week5.pdf",
      fileType: "pdf",
      uploadDate: "2 hours ago",
      size: "2.4 MB",
      status: "ready",
      courseCode: "CS101",
      courseTitle: "Introduction to Computer Science",
      tag: "course-material",
    },
    {
      id: "2",
      title: "Data_Structures_Chapter3.docx",
      fileType: "docx",
      uploadDate: "1 day ago",
      size: "1.8 MB",
      status: "ready",
      courseCode: "CS201",
      courseTitle: "Data Structures and Algorithms",
      tag: "textbook",
    },
    {
      id: "3",
      title: "Algorithm_Analysis.pdf",
      fileType: "pdf",
      uploadDate: "2 days ago",
      size: "3.1 MB",
      status: "processing",
      courseCode: "CS201",
      courseTitle: "Data Structures and Algorithms",
      tag: "course-material",
    },
    {
      id: "4",
      title: "My_Study_Notes.pdf",
      fileType: "pdf",
      uploadDate: "3 days ago",
      size: "856 KB",
      status: "ready",
      courseCode: "MATH301",
      courseTitle: "Linear Algebra",
      tag: "personal-notes",
    },
    {
      id: "5",
      title: "Physics_Lab_Report.docx",
      fileType: "docx",
      uploadDate: "5 days ago",
      size: "3.2 MB",
      status: "failed",
      courseCode: "PHYS101",
      courseTitle: "General Physics",
      tag: "course-material",
    },
    {
      id: "6",
      title: "Calculus_Practice_Problems.pdf",
      fileType: "pdf",
      uploadDate: "1 week ago",
      size: "1.2 MB",
      status: "ready",
      courseCode: "MATH201",
      courseTitle: "Calculus II",
      tag: "course-material",
    },
  ]);

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircleIcon size={12} className="mr-1" />
            Ready
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <LoaderIcon size={12} className="mr-1 animate-spin" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircleIcon size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const EmptyState = () => (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FolderIcon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No documents yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Start by uploading your study materials. Your documents will appear here
        once uploaded.
      </p>
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={() => setShowUploadModal(true)}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <PlusIcon size={20} className="mr-2" />
        Add Your First Document
      </motion.button>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Documents</h1>
          <p className="text-gray-600">
            Manage your study materials and learning resources
          </p>
        </div>
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Document
        </motion.button>
      </div>

      {/* Search and Filter Bar */}
      {documents.length > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow relative">
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <FilterIcon size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length === 0 && documents.length === 0 ? (
        <EmptyState />
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">
            No documents match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all group"
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-grow min-w-0">
                  <div className="mt-1">{getFileIcon(doc.fileType)}</div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-800 truncate mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">{getStatusBadge(doc.status)}</div>

              {/* Course Info */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-medium">{doc.courseCode}</span>
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {doc.courseTitle}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View"
                  >
                    <EyeIcon size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Download"
                  >
                    <DownloadIcon size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2Icon size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <PopUp
        openPopup={showUploadModal}
        setOpenPopup={setShowUploadModal}
        cancel={true}
        title="Add Document"
      >
        {/* <ArtisanFilterForm onCompleted={onCompleted} initialValues={options} /> */}
        <DocumentsForm setShowUploadModal={setShowUploadModal} />
      </PopUp>
      {/* Upload Modal */}
      {/* <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !isUploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                duration: 0.3,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Document
                </h2>
                {!isUploading && (
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};
export default UploadPage;
