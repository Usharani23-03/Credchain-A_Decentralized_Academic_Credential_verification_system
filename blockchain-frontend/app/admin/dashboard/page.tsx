"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RoleGuard from "@/components/auth/RoleGuard";

import { getAdminDashboard } from "@/services/dashboard";

import {
  Users,
  FileText,
  ShieldCheck,
} from "lucide-react";


export default function AdminDashboard() {

  const [data, setData] = useState({
    totalUsers: 0,
    totalCertificates: 0,
    universities: 0,
  });


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const result = await getAdminDashboard();

        setData(result);

      } catch (error) {

        console.error(
          "Failed to fetch admin dashboard data",
          error
        );

      }

    };


    fetchDashboard();

  }, []);



  return (
    <RoleGuard allowedRole="ADMIN">

      <DashboardLayout>

        <h1 className="text-3xl font-bold text-white mb-8">
          Admin Dashboard
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          <DashboardCard
            title="Total Users"
            value={data.totalUsers}
            icon={<Users size={30} />}
            color="cyan"
          />


          <DashboardCard
            title="Total Certificates"
            value={data.totalCertificates}
            icon={<FileText size={30} />}
            color="green"
          />


          <DashboardCard
            title="Universities Registered"
            value={data.universities}
            icon={<ShieldCheck size={30} />}
            color="yellow"
          />


        </div>


        <QuickActions role="ADMIN" />


      </DashboardLayout>

    </RoleGuard>
  );
}