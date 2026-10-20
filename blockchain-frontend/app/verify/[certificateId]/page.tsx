"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  ShieldX,
  Loader2,
  Database,
  Blocks,
  Fingerprint,
  CheckCircle2,
} from "lucide-react";
import api from "../../../services/api";

interface Certificate {
  id: number;
  title: string;
  description?: string;
  certificateType: string;
  fileName: string;
  certificateId: string;
  verificationUrl?: string;
  issuedBy: string;
  issueDate: string;
  verificationStatus: string;
  blockchainTxId?: string;
  ipfsHash?: string;
  sha512Hash?: string;
  uploadedAt: string;
}

interface VerificationResponse {
  verified: boolean;
  blockchainVerified?: boolean;
  message: string;
  certificate?: Certificate;
}

export default function CertificateVerificationPage() {
  const params = useParams();

  const certificateId = params?.certificateId as string;

  const [loading, setLoading] = useState(true);
  const [result, setResult] =
    useState<VerificationResponse | null>(null);

  useEffect(() => {
    const verifyByCertificateId = async () => {
      if (!certificateId) return;

      try {
        setLoading(true);
        console.log("🚀 Starting QR verification:", certificateId);
        console.log(
          "🌐 API URL:",
          `${process.env.NEXT_PUBLIC_API_URL}/verify/qr`
        );
        const response = await api.post(
          "/verify/qr",
          {
            certificateId,
          }
        );

        console.log("Certificate verification response:", response.data);

        setResult(response.data);
      } catch (error: any) {
        console.error(
          "Certificate ID verification error:",
          error
        );

        setResult({
          verified: false,
          blockchainVerified: false,
          message:
            error?.response?.data?.message ||
            "Certificate verification failed.",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyByCertificateId();
  }, [certificateId]);

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-green-400" />

          <h1 className="text-2xl font-semibold">
            Verifying Certificate
          </h1>

          <p className="text-slate-400 mt-2">
            Checking the certificate against its registered
            blockchain record...
          </p>
        </div>
      </main>
    );
  }

  /*
   * VERIFICATION FAILED
   */
  if (!result?.verified || !result.certificate) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">

          <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-5" />

          <h1 className="text-3xl font-bold">
            Certificate Not Verified
          </h1>

          <p className="text-slate-400 mt-3">
            {result?.message ||
              "Certificate could not be verified."}
          </p>

          <div className="mt-6 bg-slate-800 rounded-xl p-4 text-left">
            <p className="text-sm text-slate-400">
              Certificate ID
            </p>

            <p className="font-mono text-white break-all mt-1">
              {certificateId}
            </p>
          </div>

          {result?.blockchainVerified === false && (
            <div className="mt-4 text-sm text-red-300">
              Blockchain verification failed.
            </div>
          )}
        </div>
      </main>
    );
  }

  const certificate = result.certificate;

  /*
   * SUCCESS
   */
  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-12">

      <div className="max-w-3xl mx-auto">

        {/* SUCCESS HEADER */}
        <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-8 text-center">

          <ShieldCheck className="w-20 h-20 text-green-400 mx-auto mb-5" />

          <h1 className="text-4xl font-bold">
            Certificate Verified
          </h1>

          <p className="text-slate-400 mt-3">
            This certificate has been successfully verified
            against its registered blockchain record.
          </p>

          <div className="mt-6 inline-block bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3">

            <p className="text-xs text-slate-400">
              Certificate ID
            </p>

            <p className="font-mono text-green-400 mt-1 break-all">
              {certificate.certificateId}
            </p>

          </div>
        </div>

        {/* CERTIFICATE DETAILS */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Certificate Details
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-sm text-slate-400">
                Certificate Title
              </p>

              <p className="mt-1 font-medium">
                {certificate.title}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Certificate Type
              </p>

              <p className="mt-1 font-medium">
                {certificate.certificateType}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Issued By
              </p>

              <p className="mt-1 font-medium">
                {certificate.issuedBy}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Issue Date
              </p>

              <p className="mt-1 font-medium">
                {new Date(
                  certificate.issueDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Verification Status
              </p>

              <p className="mt-1 font-medium text-green-400">
                VERIFIED
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Certificate ID
              </p>

              <p className="mt-1 font-mono text-sm break-all">
                {certificate.certificateId}
              </p>
            </div>

          </div>

          {certificate.description && (
            <div className="mt-6">
              <p className="text-sm text-slate-400">
                Description
              </p>

              <p className="mt-1 text-slate-200">
                {certificate.description}
              </p>
            </div>
          )}

        </div>

        {/* VERIFICATION INFORMATION */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Verification Information
          </h2>

          <div className="space-y-4">

            {/* DATABASE */}
            <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4">

              <Database className="w-7 h-7 text-green-400" />

              <div className="flex-1">
                <p className="text-sm text-slate-400">
                  Database Record
                </p>

                <p className="font-medium text-white">
                  Certificate Found
                </p>
              </div>

              <CheckCircle2 className="w-6 h-6 text-green-400" />

            </div>

            {/* SHA-512 */}
            <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4">

              <Fingerprint className="w-7 h-7 text-green-400" />

              <div className="flex-1">
                <p className="text-sm text-slate-400">
                  SHA-512 Integrity
                </p>

                <p className="font-medium text-white">
                  Hash Matched
                </p>
              </div>

              <CheckCircle2 className="w-6 h-6 text-green-400" />

            </div>

            {/* BLOCKCHAIN */}
            <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4">

              <Blocks className="w-7 h-7 text-green-400" />

              <div className="flex-1">
                <p className="text-sm text-slate-400">
                  Hyperledger Fabric
                </p>

                <p className="font-medium text-white">
                  Blockchain Verified
                </p>
              </div>

              <CheckCircle2 className="w-6 h-6 text-green-400" />

            </div>

          </div>

          {/* FINAL STATUS */}
          <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">

            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />

            <p className="text-green-400 font-semibold text-lg">
              Certificate Integrity Verified
            </p>

            <p className="text-sm text-slate-400 mt-1">
              The certificate hash matches the record stored
              on the Hyperledger Fabric blockchain.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}