"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RoleGuard from "@/components/auth/RoleGuard";

import { getUniversityDashboard } from "@/services/dashboard";

import {
  Upload,
  Users,
  FileCheck,
} from "lucide-react";


export default function UniversityDashboard() {

  const [data, setData] = useState({
    certificatesIssued: 0,
    studentsRegistered: 0,
    pendingRequests: 0,
  });


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const result = await getUniversityDashboard();

        setData(result);

      } catch (error) {

        console.error(
          "Failed to fetch university dashboard data",
          error
        );

      }

    };


    fetchDashboard();

  }, []);



  return (
    <RoleGuard allowedRole="UNIVERSITY">

      <DashboardLayout>

        <h1 className="text-3xl font-bold text-white mb-8">
          University Dashboard
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          <DashboardCard
            title="Certificates Issued"
            value={data.certificatesIssued}
            icon={<FileCheck size={30} />}
            color="cyan"
          />


          <DashboardCard
            title="Students Registered"
            value={data.studentsRegistered}
            icon={<Users size={30} />}
            color="green"
          />


          <DashboardCard
            title="Pending Requests"
            value={data.pendingRequests}
            icon={<Upload size={30} />}
            color="yellow"
          />


        </div>


        <QuickActions role="UNIVERSITY" />


      </DashboardLayout>

    </RoleGuard>
  );
}