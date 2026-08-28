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

  const getDashboardPath = (role: string) => {

    switch (role) {

      case "STUDENT":
        return "/student/dashboard";

      case "UNIVERSITY":
        return "/university/dashboard";

      case "EMPLOYER":
        return "/employer/dashboard";

      case "ADMIN":
        return "/admin/dashboard";

      default:
        return "/";

    }

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const data = await registerUser(form);

      // Save authentication details immediately
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Registration successful! Redirecting to your dashboard..."
      );

      // Redirect directly to the user's dashboard
      setTimeout(() => {

        router.push(
          getDashboardPath(data.user.role)
        );

      }, 1000);

    } catch (error: any) {

      setMessage(
        error.response?.data?.message ||
        "Registration failed."
      );

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
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
          required
          minLength={6}
        />

        <select
          name="role"
          className="w-full p-3 mb-6 rounded-lg bg-slate-800 text-white"
          onChange={handleChange}
          defaultValue="STUDENT"
        >

          <option value="STUDENT">
            Student
          </option>

          <option value="UNIVERSITY">
            University
          </option>

          <option value="EMPLOYER">
            Employer
          </option>

          <option value="ADMIN">
            Admin
          </option>

        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-lg font-semibold text-white disabled:opacity-60"
        >

          {loading
            ? "Registering..."
            : "Register"}

        </button>

      </form>

    </main>

  );

}