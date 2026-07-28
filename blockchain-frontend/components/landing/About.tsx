import {
  GraduationCap,
  University,
  UserCheck,
  Shield,
} from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="bg-slate-900 py-24 text-white"
    >
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="text-cyan-400 uppercase tracking-widest font-semibold">
            ABOUT CREDCHAIN
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Secure Academic Credential Management
          </h2>

          <p className="text-slate-400 text-lg mt-6 max-w-3xl mx-auto leading-8">
            CredChain is a decentralized platform that enables educational
            institutions to issue, manage, and verify academic credentials
            securely using Hyperledger Fabric Blockchain and IPFS technology.
            It eliminates certificate forgery and provides instant verification
            with tamper-proof records.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-slate-800 rounded-2xl p-8">

            <University
              className="text-cyan-400 mb-6"
              size={48}
            />

            <h3 className="text-2xl font-semibold mb-4">
              University
            </h3>

            <p className="text-slate-400 leading-7">
              Authorized institutions securely issue and manage academic
              certificates on the blockchain.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-8">

            <GraduationCap
              className="text-cyan-400 mb-6"
              size={48}
            />

            <h3 className="text-2xl font-semibold mb-4">
              Students
            </h3>

            <p className="text-slate-400 leading-7">
              Students receive tamper-proof digital credentials that can be
              securely shared anywhere.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-8">

            <UserCheck
              className="text-cyan-400 mb-6"
              size={48}
            />

            <h3 className="text-2xl font-semibold mb-4">
              Verifiers
            </h3>

            <p className="text-slate-400 leading-7">
              Employers and organizations instantly verify certificate
              authenticity without contacting the issuing institution.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-8">

            <Shield
              className="text-cyan-400 mb-6"
              size={48}
            />

            <h3 className="text-2xl font-semibold mb-4">
              Security
            </h3>

            <p className="text-slate-400 leading-7">
              Blockchain, SHA-512 hashing, and IPFS ensure integrity,
              transparency, and tamper-proof credential storage.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}