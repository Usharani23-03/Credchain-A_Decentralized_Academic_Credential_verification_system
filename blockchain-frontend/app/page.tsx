import Link from "next/link";
import { ShieldCheck, Upload, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          BlockVerify
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg border border-cyan-500 hover:bg-cyan-500 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-5xl font-bold leading-tight">
          Blockchain Certificate
          <br />
          Verification System
        </h2>

        <p className="mt-6 max-w-2xl text-slate-300 text-lg">
          Securely upload, verify, and manage academic certificates using
          Hyperledger Fabric and blockchain technology.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="bg-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-600"
          >
            Get Started
          </Link>

          <Link
            href="/verify"
            className="border border-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-500"
          >
            Verify Certificate
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-10 pb-20">
        <div className="bg-slate-900 p-8 rounded-xl">
          <ShieldCheck className="text-cyan-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">
            Secure Verification
          </h3>
          <p className="text-slate-400">
            Certificates are protected using blockchain technology.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl">
          <Upload className="text-cyan-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">
            Upload Certificates
          </h3>
          <p className="text-slate-400">
            Store certificate details securely with immutable records.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl">
          <Search className="text-cyan-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">
            Instant Verification
          </h3>
          <p className="text-slate-400">
            Verify certificates quickly using blockchain-backed records.
          </p>
        </div>
      </section>
    </main>
  );
}