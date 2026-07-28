"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RoleGuard from "@/components/auth/RoleGuard";

import { getStudentDashboard } from "@/services/dashboard";

import {
  Award,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function StudentDashboard() {

  const [data, setData] = useState({
    totalCertificates: 0,
    verifiedCertificates: 0,
    pendingCertificates: 0,
  });


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const result = await getStudentDashboard();

        setData(result);

      } catch (error) {

        console.error(
          "Failed to fetch dashboard data",
          error
        );

      }

    };


    fetchDashboard();

  }, []);


  return (
    <RoleGuard allowedRole="STUDENT">

      <DashboardLayout>

        <h1 className="text-3xl font-bold text-white mb-8">
          Student Dashboard
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <DashboardCard
            title="My Certificates"
            value={data.totalCertificates}
            icon={<Award size={30} />}
            color="cyan"
          />


          <DashboardCard
            title="Verified Certificates"
            value={data.verifiedCertificates}
            icon={<CheckCircle size={30} />}
            color="green"
          />


          <DashboardCard
            title="Pending Verification"
            value={data.pendingCertificates}
            icon={<Clock size={30} />}
            color="yellow"
          />

        </div>


        <QuickActions role="STUDENT" />


      </DashboardLayout>

    </RoleGuard>
  );
}