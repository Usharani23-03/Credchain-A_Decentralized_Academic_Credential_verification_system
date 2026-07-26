"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [name, setName] = useState("User");

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);
      setName(user.name);
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 p-10 shadow-2xl mb-10">

      {/* Decorative circles */}

      <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3 mb-4">

            <Sparkles className="text-yellow-300" />

            <span className="uppercase tracking-[0.25em] text-sm text-cyan-100">
              Blockchain Dashboard
            </span>

          </div>

          <h1 className="text-5xl font-bold text-white">
            Welcome back,
          </h1>

          <h2 className="mt-2 text-4xl font-extrabold text-yellow-200">
            {name} 👋
          </h2>

          <p className="mt-5 max-w-2xl text-cyan-100 text-lg">
            Securely upload, manage and verify academic certificates
            using Hyperledger Fabric, IPFS and Blockchain Technology.
          </p>

          <button className="mt-8 rounded-xl bg-white text-slate-900 px-8 py-4 font-semibold hover:scale-105 transition">
            Explore Dashboard
          </button>

        </div>

        {/* Right decoration */}

        <div className="hidden lg:flex items-center justify-center">

          <div className="grid grid-cols-4 gap-5">

            {[...Array(16)].map((_, index) => (
              <div
                key={index}
                className="h-5 w-5 rounded-full bg-white/30"
              />
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}