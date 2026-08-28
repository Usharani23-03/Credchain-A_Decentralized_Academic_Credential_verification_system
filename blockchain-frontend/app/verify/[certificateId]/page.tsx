"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  UploadCloud,
  ShieldCheck,
  ShieldX,
  FileText,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { verifyCertificate } from "../../../services/verify";

interface VerificationResult {
  verified: boolean;
  document?: {
    title: string;
    certificateType: string;
    issuedBy: string;
    issueDate: string;
    verificationStatus: string;
    blockchainTxId: string;
    fileHash: string;
  };
  message?: string;
}

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();

  const certificateId = params?.certificateId as string;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!file) {
      alert("Please select the certificate PDF.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();

      formData.append("certificate", file);

      const response = await verifyCertificate(formData);

      setResult(response);
    } catch (error: any) {
      setResult({
        verified: false,
        message:
          error?.response?.data?.message ||
          "Verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => router.push("/verify")}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Verification
        </button>

        <div className="text-center mb-10">

          <div className="flex justify-center mb-5">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
              <ShieldCheck
                size={50}
                className="text-cyan-400"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold">
            Certificate Verification
          </h1>

          <p className="text-slate-400 mt-3">
            Verify the authenticity of an academic certificate using CredChain.
          </p>

        </div>

        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 md:p-10">

          <div className="bg-slate-900 rounded-2xl p-5 mb-8 border border-slate-800">

            <p className="text-sm text-slate-400">
              Certificate ID
            </p>

            <div className="flex items-center gap-3 mt-2">

              <FileText
                size={22}
                className="text-cyan-400"
              />

              <p className="text-lg md:text-xl font-semibold text-cyan-400 break-all">
                {certificateId}
              </p>

            </div>

          </div>

          <h2 className="text-2xl font-semibold">
            Upload Certificate
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Upload the original certificate PDF to verify its authenticity
            against the stored blockchain record.
          </p>

          <label
            htmlFor="certificate"
            className="border-2 border-dashed border-cyan-500/60 rounded-2xl p-10 md:p-14 flex flex-col items-center cursor-pointer hover:bg-slate-900 transition"
          >

            <UploadCloud
              size={60}
              className="text-cyan-400"
            />

            <h3 className="text-xl md:text-2xl mt-5 font-semibold">
              Select Certificate PDF
            </h3>

            <p className="text-slate-400 mt-2">
              Click here to browse your certificate
            </p>

            {file && (
              <div className="mt-6 text-center">

                <p className="text-cyan-400 font-medium">
                  Selected File
                </p>

                <p className="text-slate-300 mt-1 break-all">
                  {file.name}
                </p>

              </div>
            )}

          </label>

          <input
            id="certificate"
            hidden
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.length) {
                setFile(e.target.files[0]);
                setResult(null);
              }
            }}
          />

          <button
            onClick={handleVerify}
            disabled={loading || !file}
            className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl py-4 font-semibold text-slate-950 transition flex items-center justify-center gap-3"
          >

            {loading && (
              <Loader2
                size={22}
                className="animate-spin"
              />
            )}

            {loading
              ? "Verifying Certificate..."
              : "Verify Certificate"}

          </button>

        </div>

        {result && (

          <div className="mt-8 bg-[#0F172A] rounded-3xl border border-slate-800 p-6 md:p-8">

            {result.verified ? (

              <>

                <div className="flex items-center gap-3 text-green-400">

                  <ShieldCheck size={40} />

                  <div>

                    <h2 className="text-3xl font-bold">
                      Certificate Verified
                    </h2>

                    <p className="text-slate-400 mt-1">
                      This certificate is authentic and verified successfully.
                    </p>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-8">

                  <Info
                    label="Certificate ID"
                    value={certificateId}
                  />

                  <Info
                    label="Title"
                    value={result.document?.title}
                  />

                  <Info
                    label="Certificate Type"
                    value={result.document?.certificateType}
                  />

                  <Info
                    label="Issued By"
                    value={result.document?.issuedBy}
                  />

                  <Info
                    label="Issue Date"
                    value={
                      result.document?.issueDate
                        ? new Date(
                            result.document.issueDate
                          ).toLocaleDateString()
                        : "-"
                    }
                  />

                  <Info
                    label="Verification Status"
                    value={result.document?.verificationStatus}
                  />

                  <div className="md:col-span-2">

                    <Info
                      label="Blockchain Transaction ID"
                      value={result.document?.blockchainTxId}
                    />

                  </div>

                  <div className="md:col-span-2">

                    <Info
                      label="Certificate Hash"
                      value={result.document?.fileHash}
                    />

                  </div>

                </div>

              </>

            ) : (

              <div className="text-center py-10">

                <ShieldX
                  size={70}
                  className="mx-auto text-red-500"
                />

                <h2 className="text-3xl font-bold text-red-400 mt-6">
                  Certificate Not Verified
                </h2>

                <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                  {result.message ||
                    "The uploaded certificate could not be verified."}
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <p className="text-white mt-2 break-all">
        {value || "-"}
      </p>

    </div>
  );
}