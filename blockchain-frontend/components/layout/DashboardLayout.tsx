"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#020617]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-10">

          {children}

        </main>

      </div>

    </div>
  );
}