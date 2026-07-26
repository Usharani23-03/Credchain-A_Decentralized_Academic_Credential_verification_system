"use client";

import { Mail, CalendarDays, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

interface Props {
  total: number;
  verified: number;
  pending: number;
}

export default function ProfileSummary({
  total,
  verified,
  pending,
}: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="w-full bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl p-8">

      {/* Avatar */}

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center">

          <UserCircle
            size={58}
            className="text-white"
          />

        </div>

        <h2 className="mt-6 text-2xl font-bold text-white text-center break-words">
          {user?.name || "User"}
        </h2>

        <span className="mt-3 bg-cyan-500/20 text-cyan-400 px-5 py-2 rounded-full text-sm font-semibold uppercase">
          {user?.role || "Student"}
        </span>

      </div>

      {/* Details */}

      <div className="mt-8 space-y-5">

        <div className="flex items-start gap-3">

          <Mail
            size={18}
            className="text-slate-400 mt-1 flex-shrink-0"
          />

          <p className="text-slate-300 text-sm leading-6 break-all">
            {user?.email || "No Email"}
          </p>

        </div>

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-slate-400"
          />

          <p className="text-slate-300">
            Joined this month
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-3 gap-4 mt-10">

        <div className="bg-slate-900 rounded-xl p-4 text-center">

          <h3 className="text-3xl font-bold text-cyan-400">
            {total}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Certificates
          </p>

        </div>

        <div className="bg-slate-900 rounded-xl p-4 text-center">

          <h3 className="text-3xl font-bold text-green-400">
            {verified}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Verified
          </p>

        </div>

        <div className="bg-slate-900 rounded-xl p-4 text-center">

          <h3 className="text-3xl font-bold text-yellow-400">
            {pending}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Pending
          </p>

        </div>

      </div>

    </div>
  );
}