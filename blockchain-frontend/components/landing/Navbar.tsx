"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-cyan-400">
          CredChain
        </h1>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-10 text-lg font-medium">

          <a
            href="#home"
            className="hover:text-cyan-400 transition"
          >
            Home
          </a>

          <a
            href="#about"
            className="hover:text-cyan-400 transition"
          >
            About
          </a>

          <a
            href="#contact"
            className="hover:text-cyan-400 transition"
          >
            Contact
          </a>

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <Link
            href="/login"
            className="px-6 py-2 rounded-lg border border-cyan-500 hover:bg-cyan-500 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}