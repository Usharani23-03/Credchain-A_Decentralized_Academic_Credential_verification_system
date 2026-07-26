"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import HeroBanner from "../../components/dashboard/HeroBanner";
import DashboardCard from "../../components/dashboard/DashboardCard";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentDocuments from "../../components/dashboard/RecentDocuments";

import { getMyDocuments } from "../../services/document";

import {
  FileText,
  BadgeCheck,
  Clock3,
  XCircle,
} from "lucide-react";

interface Document {
  id: number;
  title: string;
  issuedBy: string;
  verificationStatus: string;
  uploadedAt: string;
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);

      const response = await getMyDocuments();

      if (Array.isArray(response)) {
        setDocuments(response);
      } else if (response.documents) {
        setDocuments(response.documents);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  // Updates UI immediately after delete
  const handleDeleteDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const totalCertificates = documents.length;

  const verifiedCertificates = documents.filter(
    (doc) => doc.verificationStatus === "VERIFIED"
  ).length;

  const pendingCertificates = documents.filter(
    (doc) => doc.verificationStatus === "PENDING"
  ).length;

  const rejectedCertificates = documents.filter(
    (doc) => doc.verificationStatus === "REJECTED"
  ).length;

  return (
    <DashboardLayout>
      <HeroBanner />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

        <DashboardCard
          title="Total Certificates"
          value={loading ? "..." : totalCertificates}
          icon={<FileText size={30} />}
          color="cyan"
        />

        <DashboardCard
          title="Verified"
          value={loading ? "..." : verifiedCertificates}
          icon={<BadgeCheck size={30} />}
          color="green"
        />

        <DashboardCard
          title="Pending"
          value={loading ? "..." : pendingCertificates}
          icon={<Clock3 size={30} />}
          color="yellow"
        />

        <DashboardCard
          title="Rejected"
          value={loading ? "..." : rejectedCertificates}
          icon={<XCircle size={30} />}
          color="red"
        />

      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">

        <div className="xl:col-span-2">
          <AnalyticsChart documents={documents} />
        </div>

        <RecentActivity />

      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <QuickActions />
      </div>

      {/* Recent Documents */}
      <div className="mt-10 mb-10">

        <RecentDocuments
          documents={documents}
          loading={loading}
          onDelete={handleDeleteDocument}
        />

      </div>

    </DashboardLayout>
  );
}