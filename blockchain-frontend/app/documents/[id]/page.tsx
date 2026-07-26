"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getDocumentById } from "../../../services/document";

interface Document {
  id: number;
  title: string;
  description: string;
  certificateType: string;
  issuedBy: string;
  issueDate: string;
  fileHash: string;
  blockchainTxId: string;
  verificationStatus: string;
}

export default function DocumentDetailsPage() {
  const { id } = useParams();

  const [document, setDocument] = useState<Document | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {
    try {
      const data = await getDocumentById(Number(id));
      setDocument(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-white">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="p-10 text-red-400">
          Document not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-10">

        <h1 className="text-4xl font-bold text-white mb-8">
          Certificate Details
        </h1>

        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8 space-y-6">

          <div>
            <p className="text-slate-400">Title</p>
            <h2 className="text-2xl text-white">
              {document.title}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Certificate Type</p>
            <h2 className="text-white">
              {document.certificateType}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Issued By</p>
            <h2 className="text-white">
              {document.issuedBy}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Issue Date</p>
            <h2 className="text-white">
              {new Date(document.issueDate).toLocaleDateString()}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <span className="px-4 py-2 rounded-full bg-cyan-500 text-white">
              {document.verificationStatus}
            </span>
          </div>

          <div>
            <p className="text-slate-400">SHA-512 Hash</p>

            <p className="text-cyan-400 break-all">
              {document.fileHash}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Blockchain Transaction
            </p>

            <p className="text-green-400 break-all">
              {document.blockchainTxId}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Description
            </p>

            <p className="text-white">
              {document.description || "-"}
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}