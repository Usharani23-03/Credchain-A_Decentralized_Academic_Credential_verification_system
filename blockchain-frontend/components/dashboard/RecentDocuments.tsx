"use client";

import { Eye, Download, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  downloadDocument,
  deleteDocument,
} from "../../services/document";

interface Document {
  id: number;
  title: string;
  issuedBy: string;
  verificationStatus: string;
}

interface RecentDocumentsProps {
  documents: Document[];
  loading: boolean;
  onDelete?: (id: number) => void;
}

export default function RecentDocuments({
  documents,
  loading,
  onDelete,
}: RecentDocumentsProps) {
  const router = useRouter();

  const handleView = (id: number) => {
    router.push(`/documents/${id}`);
  };

  const handleDownload = async (id: number) => {
  try {
    const response = await downloadDocument(id);

    const blob = response.data;

    // Get the actual file type returned by the backend
    const contentType =
      response.headers["content-type"] || blob.type;

    let extension = "pdf";

    if (contentType.includes("jpeg")) {
      extension = "jpg";
    } else if (contentType.includes("png")) {
      extension = "png";
    } else if (contentType.includes("pdf")) {
      extension = "pdf";
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `certificate-${id}.${extension}`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Download failed.");
  }
};

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmed) return;

    try {
      await deleteDocument(id);

      alert("Certificate deleted successfully.");

      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  return (
    <section className="mt-10">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Recent Documents
            </h2>

            <p className="text-slate-400 mt-1">
              Recently uploaded certificates
            </p>
          </div>

          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl transition"
            onClick={() => router.push("/documents")}
          >
            View All
          </button>

        </div>

        {loading ? (

          <div className="p-10 text-center text-slate-400">
            Loading documents...
          </div>

        ) : documents.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20">

            <FileText
              size={70}
              className="text-slate-600"
            />

            <h3 className="text-2xl font-semibold text-white mt-5">
              No Documents Yet
            </h3>

            <p className="text-slate-400 mt-2">
              Upload your first blockchain certificate.
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="text-left py-5 px-8 text-slate-300">
                  Certificate
                </th>

                <th className="text-left py-5 px-8 text-slate-300">
                  Issued By
                </th>

                <th className="text-left py-5 px-8 text-slate-300">
                  Status
                </th>

                <th className="text-center py-5 px-8 text-slate-300">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {documents.map((doc) => (

                <tr
                  key={doc.id}
                  className="border-t border-slate-800 hover:bg-slate-900 transition"
                >

                  <td className="px-8 py-6 text-white font-medium">
                    {doc.title}
                  </td>

                  <td className="px-8 py-6 text-slate-300">
                    {doc.issuedBy}
                  </td>

                  <td className="px-8 py-6">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        doc.verificationStatus === "VERIFIED"
                          ? "bg-green-500/20 text-green-400"
                          : doc.verificationStatus === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>

                  </td>

                  <td className="px-8 py-6">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleView(doc.id)}
                        className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition"
                        title="View"
                      >
                        <Eye
                          size={18}
                          className="text-white"
                        />
                      </button>

                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
                        title="Download"
                      >
                        <Download
                          size={18}
                          className="text-white"
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
                        title="Delete"
                      >
                        <Trash2
                          size={18}
                          className="text-white"
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>
    </section>
  );
}