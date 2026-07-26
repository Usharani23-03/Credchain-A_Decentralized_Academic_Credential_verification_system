"use client";

import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [name, setName] = useState("User");

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);
      setName(user.name);
    }
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">
        Welcome, {name} 👋
      </h1>

      <p className="text-slate-400 mt-2">
        Manage and verify blockchain certificates securely.
      </p>
    </div>
  );
}