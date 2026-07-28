"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllCertificates } from "@/services/admin";

interface Certificate {
  id: number;
  title: string;
  certificateType: string;
  issuedBy: string;
  verificationStatus: string;
  uploadedAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function CertificateMonitoringPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      const response = await getAllCertificates();
      setCertificates(response.certificates);
    } catch (error) {
      console.error("Failed to fetch certificates", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-600";
      case "PENDING":
        return "bg-yellow-500";
      case "REJECTED":
        return "bg-red-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Certificate Monitoring
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor all certificates uploaded in the system.
        </p>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-x-auto">

        {loading ? (

          <div className="p-8 text-center text-white">
            Loading certificates...
          </div>

        ) : certificates.length === 0 ? (

          <div className="p-8 text-center text-slate-400">
            No certificates found.
          </div>

        ) : (

          <table className="min-w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="px-6 py-4 text-left text-slate-300">
                  Title
                </th>

                <th className="px-6 py-4 text-left text-slate-300">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-slate-300">
                  Issued By
                </th>

                <th className="px-6 py-4 text-left text-slate-300">
                  Uploaded By
                </th>

                <th className="px-6 py-4 text-left text-slate-300">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-slate-300">
                  Upload Date
                </th>

              </tr>

            </thead>

            <tbody>

              {certificates.map((certificate) => (

                <tr
                  key={certificate.id}
                  className="border-t border-slate-800 hover:bg-slate-900 transition"
                >

                  <td className="px-6 py-4 text-white">
                    {certificate.title}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {certificate.certificateType}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {certificate.issuedBy}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-white">
                      {certificate.user.name}
                    </div>

                    <div className="text-sm text-slate-400">
                      {certificate.user.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(
                        certificate.verificationStatus
                      )}`}
                    >
                      {certificate.verificationStatus}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {new Date(
                      certificate.uploadedAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </DashboardLayout>
  );
}