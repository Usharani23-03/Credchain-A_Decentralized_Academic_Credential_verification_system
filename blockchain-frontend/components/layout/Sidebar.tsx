"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Certificate",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "My Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Verify Certificate",
    href: "/verify",
    icon: Search,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 min-h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col">

      <div className="px-8 py-8">

        <h1 className="text-4xl font-bold">
          <span className="text-cyan-400">Block</span>
          <span className="text-white">Verify</span>
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Blockchain Certificate Verification
        </p>

      </div>

      <nav className="flex-1 px-5">

        {menus.map((menu) => {

          const Icon = menu.icon;

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.title}
              href={menu.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 mb-3 transition-all duration-300

              ${
                active
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={22} />

              <span className="text-lg">
                {menu.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5">

        <button
          onClick={logout}
          className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={22} />

          Logout
        </button>

      </div>
    </aside>
  );
}