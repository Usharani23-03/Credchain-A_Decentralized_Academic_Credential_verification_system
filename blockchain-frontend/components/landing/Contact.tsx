import {
  Mail,
  MapPin,
  Phone,
  GitBranch,
} from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-slate-950 text-white py-24 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="text-cyan-400 uppercase tracking-widest font-semibold">
            CONTACT
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Get in Touch
          </h2>

          <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
            Have questions about CredChain or want to learn more about the
            project? We'd love to hear from you.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left */}

          <div className="bg-slate-900 rounded-2xl p-10">

            <h3 className="text-3xl font-bold mb-8 text-cyan-400">
              CredChain
            </h3>

            <p className="text-slate-400 leading-8">
              A decentralized academic credential verification platform
              developed using Hyperledger Fabric, IPFS, and Blockchain
              technology to ensure secure, transparent, and tamper-proof
              academic credential management.
            </p>

          </div>

          {/* Right */}

          <div className="bg-slate-900 rounded-2xl p-10 space-y-8">

            <div className="flex items-center gap-5">

              <Mail className="text-cyan-400" size={28} />

              <div>

                <p className="font-semibold">Email</p>

                <p className="text-slate-400">
                  your-email@example.com
                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <Phone className="text-cyan-400" size={28} />

              <div>

                <p className="font-semibold">Phone</p>

                <p className="text-slate-400">
                  +91 XXXXX XXXXX
                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <MapPin className="text-cyan-400" size={28} />

              <div>

                <p className="font-semibold">Institution</p>

                <p className="text-slate-400">
                  Sir M. Visvesvaraya Institute of Technology
                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <GitBranch className="text-cyan-400" size={28} />
              <div>

                <p className="font-semibold">GitHub</p>

                <p className="text-slate-400">
                  github.com/your-project
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-800 mt-20 pt-8 text-center text-slate-500">

          © 2026 CredChain — Decentralized Academic Credential Verification System

        </div>

      </div>
    </section>
  );
}