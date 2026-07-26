"use client";

import { useState } from "react";
import { UploadCloud, ShieldCheck, ShieldX } from "lucide-react";
import { verifyCertificate } from "../../services/verify";

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

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!file) {
      alert("Please select a certificate.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("certificate", file);

      const response = await verifyCertificate(formData);

      setResult(response);

    } catch (error: any) {

      setResult({
        verified: false,
        message:
          error?.response?.data?.message ||
          "Verification failed.",
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">

      <h1 className="text-4xl font-bold">
        Verify Certificate
      </h1>

      <p className="text-slate-400 mt-2">
        Upload a certificate to verify its authenticity.
      </p>

      <div className="mt-10 bg-[#0F172A] rounded-3xl border border-slate-800 p-10">

        <label
          htmlFor="certificate"
          className="border-2 border-dashed border-cyan-500 rounded-2xl p-12 flex flex-col items-center cursor-pointer hover:bg-slate-900 transition"
        >

          <UploadCloud
            size={60}
            className="text-cyan-400"
          />

          <h2 className="text-2xl mt-5">
            Upload Certificate
          </h2>

          <p className="text-slate-400 mt-2">
            Click here to browse
          </p>

          {file && (
            <p className="mt-6 text-cyan-400">
              {file.name}
            </p>
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
            }
          }}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 rounded-xl py-4 font-semibold"
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>

      </div>

      {result && (

        <div className="mt-10 bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

          {result.verified ? (

            <>

              <div className="flex items-center gap-3 text-green-400">

                <ShieldCheck size={35} />

                <h2 className="text-3xl font-bold">
                  Certificate Verified
                </h2>

              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">

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
                  label="Status"
                  value={result.document?.verificationStatus}
                />

                <Info
                  label="Blockchain Tx"
                  value={result.document?.blockchainTxId}
                />

                <div className="md:col-span-2">

                  <Info
                    label="File Hash"
                    value={result.document?.fileHash}
                  />

                </div>

              </div>

            </>

          ) : (

            <div className="text-center py-8">

              <ShieldX
                size={70}
                className="mx-auto text-red-500"
              />

              <h2 className="text-3xl font-bold text-red-400 mt-6">
                Certificate Not Verified
              </h2>

              <p className="text-slate-400 mt-4">
                {result.message}
              </p>

            </div>

          )}

        </div>

      )}

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
    <div className="bg-slate-900 rounded-xl p-5">

      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <p className="text-white mt-2 break-all">
        {value || "-"}
      </p>

    </div>
  );
}