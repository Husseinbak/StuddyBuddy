"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BrainIcon,
  XIcon,
} from "lucide-react";
import PopUp from "@/components/shared/popup";
import DocumentsForm, { DocumentItem } from "./form";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { toast } from "sonner";

const initialSampleDocuments: DocumentItem[] = [
  {
    id: "sample-1",
    title: "Lecture_Notes_Week5.pdf",
    fileType: "pdf",
    uploadDate: "2 hours ago",
    size: "2.4 MB",
    status: "ready",
    courseCode: "CS101",
    courseTitle: "Introduction to Computer Science",
    tag: "course-material",
    textContent: "Fundamental concepts of computational problem solving, data representations, algorithms, and modular design. Binary representations, CPU architecture, and basic control flow.",
  },
  {
    id: "sample-2",
    title: "Data_Structures_Chapter3.docx",
    fileType: "docx",
    uploadDate: "1 day ago",
    size: "1.8 MB",
    status: "ready",
    courseCode: "CS201",
    courseTitle: "Data Structures and Algorithms",
    tag: "textbook",
    textContent: "Linear and non-linear data structures: Arrays, Linked Lists, Stacks, Queues, Binary Trees, and Hash Tables. Time and space complexities using Big-O notation.",
  },
  {
    id: "sample-3",
    title: "Biology_Cell_Structure_Notes.pdf",
    fileType: "pdf",
    uploadDate: "3 days ago",
    size: "856 KB",
    status: "ready",
    courseCode: "BIO101",
    courseTitle: "General Biology",
    tag: "personal-notes",
    textContent: "Cellular biology: Structure and function of animal and plant cells. Mitochondria for ATP synthesis, ribosomes for protein translation, chloroplasts for photosynthesis.",
  },
  {
    id: "sample-4",
    title: "Calculus_Practice_Problems.pdf",
    fileType: "pdf",
    uploadDate: "1 week ago",
    size: "1.2 MB",
    status: "ready",
    courseCode: "MATH201",
    courseTitle: "Calculus II",
    tag: "course-material",
    textContent: "Integration techniques: Integration by parts, partial fractions, trigonometric substitutions, and improper integrals with real-world physics applications.",
  },
];

const DocumentsPage = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [documents, setDocuments] = useState<DocumentItem[]>(initialSampleDocuments);
  const [selectedDocForView, setSelectedDocForView] = useState<DocumentItem | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  // Fetch user documents from Firestore if available
  useEffect(() => {
    async function fetchUserDocs() {
      if (!user?.uid) return;
      setIsLoadingDocs(true);
      try {
        const q = query(
          collection(db, "documents"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const userDocs: DocumentItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<DocumentItem, "id">),
          }));
          // Combine user docs with sample docs
          setDocuments([...userDocs, ...initialSampleDocuments]);
        }
      } catch (err) {
        console.error("Failed to load documents from Firestore", err);
      } finally {
        setIsLoadingDocs(false);
      }
    }
    fetchUserDocs();
  }, [user]);

  const handleDocumentUploaded = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      if (user?.uid && !id.startsWith("sample-")) {
        await deleteDoc(doc(db, "documents", id));
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDocForView?.id === id) {
        setSelectedDocForView(null);
      }
      toast.success("Document deleted successfully");
    } catch (err) {
      console.error("Delete document error:", err);
      toast.error("Failed to delete document");
    }
  };

  const handleDownloadDocument = (docItem: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = docItem.textContent || `Study document: ${docItem.title}\nCourse: ${docItem.courseCode} - ${docItem.courseTitle}\nUploaded: ${docItem.uploadDate}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docItem.title.replace(/\.[^/.]+$/, "")}_extracted.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info(`Downloaded: ${docItem.title}`);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircleIcon size={12} className="mr-1" />
            Ready for Quiz
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <LoaderIcon size={12} className="mr-1 animate-spin" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study Documents</h1>
          <p className="text-gray-600">
            Manage your uploaded learning materials and generate AI practice quizzes
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusIcon size={18} className="mr-2" />
          Add Document
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by course code, title, or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FilterIcon size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready for Quiz</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoadingDocs ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <LoaderIcon size={32} className="mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-gray-600">Loading your course materials...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FolderIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No documents found</h3>
          <p className="text-gray-500 mb-4 text-sm">
            {searchQuery
              ? "No documents matched your query. Try a different search."
              : "Upload your first study document to generate practice assessments."}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Upload Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((docItem, index) => (
            <motion.div
              key={docItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelectedDocForView(docItem)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Document Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="mt-0.5">{getFileIcon(docItem.fileType)}</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-sm">
                        {docItem.title}
                      </h3>
                      <p className="text-xs text-gray-500">{docItem.size}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-3">{getStatusBadge(docItem.status)}</div>

                {/* Course Info */}
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded mb-1">
                    {docItem.courseCode}
                  </span>
                  <p className="text-xs text-gray-600 font-medium truncate">
                    {docItem.courseTitle}
                  </p>
                  <p className="text-[11px] text-gray-400 capitalize mt-0.5">
                    Tag: {docItem.tag.replace("-", " ")}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">{docItem.uploadDate}</span>

                <div className="flex items-center space-x-1">
                  <Link
                    href={`/quiz`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold flex items-center mr-1"
                    title="Generate Quiz"
                  >
                    <BrainIcon size={16} className="mr-1" />
                    Quiz
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocForView(docItem);
                    }}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="View preview"
                  >
                    <EyeIcon size={16} />
                  </button>

                  <button
                    onClick={(e) => handleDownloadDocument(docItem, e)}
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                    title="Download document"
                  >
                    <DownloadIcon size={16} />
                  </button>

                  <button
                    onClick={(e) => handleDeleteDocument(docItem.id, e)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete document"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <PopUp
        openPopup={showUploadModal}
        setOpenPopup={setShowUploadModal}
        cancel={true}
        title="Upload Study Material"
      >
        <DocumentsForm
          setShowUploadModal={setShowUploadModal}
          onDocumentUploaded={handleDocumentUploaded}
        />
      </PopUp>

      {/* View Document Preview Modal */}
      <AnimatePresence>
        {selectedDocForView && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedDocForView.fileType)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {selectedDocForView.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedDocForView.courseCode} • {selectedDocForView.courseTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocForView(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 block">File Size:</span>
                    <span className="font-semibold text-gray-700">{selectedDocForView.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Format:</span>
                    <span className="font-semibold text-gray-700 uppercase">{selectedDocForView.fileType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Tag:</span>
                    <span className="font-semibold text-gray-700 capitalize">{selectedDocForView.tag.replace("-", " ")}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Status:</span>
                    <span className="font-semibold text-green-600 capitalize">{selectedDocForView.status}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Document Excerpt / Grounding Content:
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-mono">
                    {selectedDocForView.textContent || "No text excerpt extracted for this document."}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={(e) => handleDownloadDocument(selectedDocForView, e)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <DownloadIcon size={16} className="mr-1.5" />
                  Download
                </button>

                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedDocForView(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <Link
                    href="/quiz"
                    className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                  >
                    <BrainIcon size={16} className="mr-1.5" />
                    Start Practice Quiz
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;
