"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import api from "@/services/api";

interface Document {
  id: number;
  title: string;
  certificateType: string;
  issuedBy: string;
  issueDate: string;
  verificationStatus: string;
  blockchainTxId: string;
}

export default function UniversityCertificatesPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents/my-documents");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRole="UNIVERSITY">
      <DashboardLayout>
        <h1 className="text-3xl font-bold text-white mb-8">
          Issued Certificates
        </h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-400">
            No certificates uploaded yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-[#0F172A] border border-slate-800">
            <table className="w-full text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="p-4 text-white">Title</th>
                  <th className="p-4 text-white">Type</th>
                  <th className="p-4 text-white">Issued By</th>
                  <th className="p-4 text-white">Status</th>
                  <th className="p-4 text-white">Blockchain ID</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t border-slate-700"
                  >
                    <td className="p-4 text-slate-200">
                      {doc.title}
                    </td>

                    <td className="p-4 text-slate-300">
                      {doc.certificateType}
                    </td>

                    <td className="p-4 text-slate-300">
                      {doc.issuedBy}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          doc.verificationStatus === "VERIFIED"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </td>

                    <td className="p-4 text-cyan-400">
                      {doc.blockchainTxId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </RoleGuard>
  );
}