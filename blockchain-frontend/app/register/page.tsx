"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await registerUser(form);
      setMessage("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          Create Account
        </h1>

        {message && (
          <p className="mb-4 text-center text-cyan-400">
            {message}
          </p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full p-3 mb-6 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
          defaultValue="STUDENT"
        >
          <option value="STUDENT">Student</option>
          <option value="UNIVERSITY">University</option>
          <option value="EMPLOYER">Employer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-lg font-semibold text-white"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}