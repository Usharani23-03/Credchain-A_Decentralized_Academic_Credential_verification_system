"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RoleGuard from "@/components/auth/RoleGuard";

import { getEmployerDashboard } from "@/services/dashboard";

import {
  CheckCircle,
  Search,
  XCircle,
} from "lucide-react";


export default function EmployerDashboard() {

  const [data, setData] = useState({
    totalVerifications: 0,
    successfulVerifications: 0,
    failedVerifications: 0,
  });


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const result = await getEmployerDashboard();

        setData(result);

      } catch (error) {

        console.error(
          "Failed to fetch employer dashboard data",
          error
        );

      }

    };


    fetchDashboard();

  }, []);



  return (
    <RoleGuard allowedRole="EMPLOYER">

      <DashboardLayout>

        <h1 className="text-3xl font-bold text-white mb-8">
          Employer Dashboard
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          <DashboardCard
            title="Total Verifications"
            value={data.totalVerifications}
            icon={<Search size={30} />}
            color="cyan"
          />


          <DashboardCard
            title="Successful Verifications"
            value={data.successfulVerifications}
            icon={<CheckCircle size={30} />}
            color="green"
          />


          <DashboardCard
            title="Failed Verifications"
            value={data.failedVerifications}
            icon={<XCircle size={30} />}
            color="red"
          />


        </div>


        <QuickActions role="EMPLOYER" />


      </DashboardLayout>

    </RoleGuard>
  );
}