"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Award,
  CheckCircle,
  Clock,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyDocuments } from "../../services/document";

interface UserType {
  name: string;
  email: string;
  role: string;
}

interface Document {
  verificationStatus: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response = await getMyDocuments();

      const docs = Array.isArray(response)
        ? response
        : response.documents || [];

      setStats({
        total: docs.length,
        verified: docs.filter(
          (d: Document) => d.verificationStatus === "VERIFIED"
        ).length,
        pending: docs.filter(
          (d: Document) => d.verificationStatus === "PENDING"
        ).length,
      });
    } catch {
      setStats({
        total: 0,
        verified: 0,
        pending: 0,
      });
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10">

        {/* Header */}

        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-10 mb-10">

          <div className="flex items-center gap-8">

            <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center">

              <User
                size={70}
                className="text-cyan-600"
              />

            </div>

            <div>

              <h1 className="text-5xl font-bold text-white">
                {user?.name}
              </h1>

              <p className="text-cyan-100 text-xl mt-2">
                {user?.role}
              </p>

            </div>

          </div>

        </div>

        {/* Information */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Personal Information */}

          <div className="lg:col-span-2 bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Personal Information
            </h2>

            <div className="space-y-8">

              <div className="flex items-center gap-4">

                <User className="text-cyan-400" />

                <div>

                  <p className="text-slate-400">
                    Full Name
                  </p>

                  <h3 className="text-white text-xl">
                    {user?.name}
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <Mail className="text-cyan-400" />

                <div>

                  <p className="text-slate-400">
                    Email
                  </p>

                  <h3 className="text-white break-all">
                    {user?.email}
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <Shield className="text-cyan-400" />

                <div>

                  <p className="text-slate-400">
                    Role
                  </p>

                  <h3 className="text-white">
                    {user?.role}
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <Calendar className="text-cyan-400" />

                <div>

                  <p className="text-slate-400">
                    Member Since
                  </p>

                  <h3 className="text-white">
                    July 2026
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Statistics */}

          <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Statistics
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <Award className="text-cyan-400" />

                  <span className="text-slate-300">
                    Certificates
                  </span>

                </div>

                <span className="text-2xl text-cyan-400 font-bold">
                  {stats.total}
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <CheckCircle className="text-green-400" />

                  <span className="text-slate-300">
                    Verified
                  </span>

                </div>

                <span className="text-2xl text-green-400 font-bold">
                  {stats.verified}
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <Clock className="text-yellow-400" />

                  <span className="text-slate-300">
                    Pending
                  </span>

                </div>

                <span className="text-2xl text-yellow-400 font-bold">
                  {stats.pending}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}