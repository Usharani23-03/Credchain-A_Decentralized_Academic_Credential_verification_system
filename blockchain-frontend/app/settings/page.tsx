"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  User,
  Mail,
  Shield,
  Lock,
  Bell,
  Moon,
  Save,
} from "lucide-react";

interface UserType {
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10">

        <h1 className="text-4xl font-bold text-white mb-10">
          Account Settings
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Personal Information */}

          <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Personal Information
            </h2>

            <div className="space-y-6">

              <div>
                <label className="text-slate-400">Full Name</label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <User className="text-cyan-400 mr-3" />
                  <input
                    value={user?.name || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Email</label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <Mail className="text-cyan-400 mr-3" />
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Role</label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <Shield className="text-cyan-400 mr-3" />
                  <input
                    value={user?.role || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Preferences */}

          <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Preferences
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between items-center bg-slate-900 p-5 rounded-xl">
                <div className="flex items-center gap-4">
                  <Bell className="text-cyan-400" />
                  <span className="text-white">
                    Email Notifications
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5"
                />
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-5 rounded-xl">
                <div className="flex items-center gap-4">
                  <Moon className="text-cyan-400" />
                  <span className="text-white">
                    Dark Mode
                  </span>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5"
                />
              </div>

              <button className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 transition rounded-xl py-4 font-semibold text-white flex justify-center items-center gap-3">
                <Save />
                Save Changes
              </button>

              <button className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl py-4 font-semibold text-white flex justify-center items-center gap-3">
                <Lock />
                Change Password
              </button>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}