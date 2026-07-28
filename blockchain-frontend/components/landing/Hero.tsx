import Link from "next/link";
import Image from "next/image";
export default function Hero() {
  return (
    <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-36"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">

        <p className="text-cyan-400 uppercase tracking-[0.35em] font-semibold mb-6">
            Secure • Trusted • Decentralized
        </p>

        <div className="flex flex-col items-center mb-6">

            <Image
                src="/credchain-logo-new.png"
                alt="CredChain Logo"
                width={220}
                height={220}
                className="mb-5"
                priority
            />

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                CredChain
            </h1>

        </div>

        <h2 className="text-3xl md:text-3xl font-semibold text-slate-300 leading-tight">
  Decentralized Academic Credential Verification System
        </h2>

        

        

      </div>
    </section>
  );
}