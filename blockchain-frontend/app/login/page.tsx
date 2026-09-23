"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log(
        "LOGIN SUCCESS RESPONSE:",
        JSON.stringify(data, null, 2)
      );

      alert(JSON.stringify(data));

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user.role;

      switch (role) {
        case "STUDENT":
          router.push("/student/dashboard");
          break;

        case "UNIVERSITY":
          router.push("/university/dashboard");
          break;

        case "EMPLOYER":
          router.push("/employer/dashboard");
          break;

        case "ADMIN":
          router.push("/admin/dashboard");
          break;

        default:
          router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-slate-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}