"use client";

import { Bell, ChevronDown, Search, User, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  name: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <header className="h-24 bg-[#0F172A] border-b border-slate-800 px-10 flex items-center justify-between">

      {/* Search */}

      <div className="relative w-[420px]">

        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          placeholder="Search anything..."
          className="w-full rounded-xl bg-[#111827] border border-slate-700 py-4 pl-14 pr-4 text-white outline-none focus:border-cyan-400"
        />

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-8">

        <div className="relative">

          <Bell className="text-white" size={24} />

          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
            3
          </span>

        </div>

        <div className="h-10 w-px bg-slate-700" />

        {/* User */}

        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-4"
          >

            <div className="h-14 w-14 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-2xl">

              {user?.name?.charAt(0).toUpperCase() || "U"}

            </div>

            <div className="text-left">

              <h3 className="text-white font-bold text-xl">

                {user?.name || "User"}

              </h3>

              <p className="text-cyan-400 uppercase">

                {user?.role || "Student"}

              </p>

            </div>

            <ChevronDown className="text-white" />

          </button>

          {open && (

            <div className="absolute right-0 mt-4 w-64 bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

              <button
                onClick={() => {
                  router.push("/profile");
                  setOpen(false);
                }}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-slate-800 text-white"
              >
                <User size={20} />
                My Profile
              </button>

              <button
                onClick={() => {
                  router.push("/settings");
                  setOpen(false);
                }}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-slate-800 text-white"
              >
                <Settings size={20} />
                Settings
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-red-600 text-red-400 hover:text-white"
              >
                <LogOut size={20} />
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}