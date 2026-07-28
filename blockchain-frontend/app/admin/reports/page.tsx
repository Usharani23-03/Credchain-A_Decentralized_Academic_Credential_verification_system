"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";

import { getReports } from "@/services/admin";

import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
} from "lucide-react";

interface ReportData {
  totalUsers: number;
  totalCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  rejectedCertificates: number;
  universities: number;

  certificateTypes: {
    certificateType: string;
    _count: {
      certificateType: number;
    };
  }[];

  recentCertificates: {
    title: string;
    certificateType: string;
    verificationStatus: string;
    uploadedAt: string;
  }[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>({
    totalUsers: 0,
    totalCertificates: 0,
    verifiedCertificates: 0,
    pendingCertificates: 0,
    rejectedCertificates: 0,
    universities: 0,
    certificateTypes: [],
    recentCertificates: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const response = await getReports();
      setData(response);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-white text-xl">
          Loading reports...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Reports
        </h1>

        <p className="text-slate-400 mt-2">
          System analytics and certificate statistics.
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

        <DashboardCard
          title="Total Users"
          value={data.totalUsers}
          icon={<Users size={28} />}
          color="cyan"
        />

        <DashboardCard
          title="Total Certificates"
          value={data.totalCertificates}
          icon={<FileText size={28} />}
          color="green"
        />

        <DashboardCard
          title="Verified"
          value={data.verifiedCertificates}
          icon={<CheckCircle size={28} />}
          color="green"
        />

        <DashboardCard
          title="Pending"
          value={data.pendingCertificates}
          icon={<Clock size={28} />}
          color="yellow"
        />

        <DashboardCard
          title="Rejected"
          value={data.rejectedCertificates}
          icon={<XCircle size={28} />}
          color="red"
        />

        <DashboardCard
          title="Universities"
          value={data.universities}
          icon={<ShieldCheck size={28} />}
          color="blue"
        />

      </div>

      {/* Certificate Types */}

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 mb-8">

        <h2 className="text-2xl font-semibold text-white mb-5">
          Certificates by Type
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left text-slate-300 py-3">
                Certificate Type
              </th>

              <th className="text-left text-slate-300 py-3">
                Count
              </th>

            </tr>

          </thead>

          <tbody>

            {data.certificateTypes.map((type) => (

              <tr
                key={type.certificateType}
                className="border-b border-slate-800"
              >

                <td className="py-4 text-white">
                  {type.certificateType}
                </td>

                <td className="py-4 text-cyan-400 font-semibold">
                  {type._count.certificateType}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Recent Certificates */}

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-semibold text-white mb-5">
          Recent Certificates
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left py-3 text-slate-300">
                Title
              </th>

              <th className="text-left py-3 text-slate-300">
                Type
              </th>

              <th className="text-left py-3 text-slate-300">
                Status
              </th>

              <th className="text-left py-3 text-slate-300">
                Uploaded
              </th>

            </tr>

          </thead>

          <tbody>

            {data.recentCertificates.map((certificate, index) => (

              <tr
                key={index}
                className="border-b border-slate-800"
              >

                <td className="py-4 text-white">
                  {certificate.title}
                </td>

                <td className="py-4 text-slate-300">
                  {certificate.certificateType}
                </td>

                <td className="py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white
                    ${
                      certificate.verificationStatus === "VERIFIED"
                        ? "bg-green-600"
                        : certificate.verificationStatus === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  >
                    {certificate.verificationStatus}
                  </span>

                </td>

                <td className="py-4 text-slate-300">
                  {new Date(
                    certificate.uploadedAt
                  ).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}