"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Upload,
  FileText,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";


// ================= STUDENT MENU =================

const studentMenus = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Credentials",
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


// ================= UNIVERSITY MENU =================

const universityMenus = [
  {
    title: "Dashboard",
    href: "/university/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Issue Certificate",
    href: "/university/upload",
    icon: Upload,
  },
  {
    title: "Issued Certificates",
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


// ================= EMPLOYER MENU =================

const employerMenus = [
  {
    title: "Dashboard",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Verify Certificate",
    href: "/verify",
    icon: Search,
  },
  {
    title: "Verification History",
    href: "/employer/history",
    icon: FileText,
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


// ================= ADMIN MENU =================

const adminMenus = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: User,
  },
  {
    title: "Certificate Monitoring",
    href: "/admin/certificates",
    icon: FileText,
  },
  {
    title: "Reports",
    href: "/admin/reports",
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

  const [role, setRole] =
    useState("");


  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem("user") || "{}"
      );

    setRole(
      user.role || ""
    );

  }, []);


  let menus: any[] = [];


  switch (role) {

    case "STUDENT":

      menus = studentMenus;

      break;


    case "UNIVERSITY":

      menus = universityMenus;

      break;


    case "EMPLOYER":

      menus = employerMenus;

      break;


    case "ADMIN":

      menus = adminMenus;

      break;


    default:

      menus = [];

  }


  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";

  };


  if (!role) {

    return null;

  }


  return (

    <aside className="w-72 min-h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col">

      <div className="px-8 py-8">

        <h1 className="text-4xl font-bold">

          <span className="text-cyan-400">
            Cred
          </span>

          <span className="text-white">
            Chain
          </span>

        </h1>


        <p className="text-slate-400 text-sm mt-2">

          Blockchain Certificate Verification

        </p>

      </div>


      <nav className="flex-1 px-5">

        {menus.map((menu) => {

          const Icon = menu.icon;

          const active =
            pathname === menu.href;


          return (

            <Link

              key={menu.title}

              href={menu.href}

              className={`flex items-center gap-4 rounded-xl px-5 py-4 mb-3 transition-all duration-300 ${
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