"use client";

import { useEffect, useState } from "react";
import { Search, FileText } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import { getMyDocuments } from "../../services/document";

interface Document {
  id: number;
  title: string;
  issuedBy: string;
  verificationStatus: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.issuedBy.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDocuments(filtered);
  }, [search, documents]);

  async function loadDocuments() {
    try {
      setLoading(true);

      const response = await getMyDocuments();

      const docs = Array.isArray(response)
        ? response
        : response.documents || [];

      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          My Documents
        </h1>

        <p className="text-slate-400 mt-2">
          View, search, download and manage all uploaded certificates.
        </p>

      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 mb-8">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by title or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 rounded-xl py-3 pl-12 pr-4 text-white outline-none"
          />

        </div>

      </div>

      {filteredDocuments.length === 0 && !loading ? (

        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-16 text-center">

          <FileText
            size={70}
            className="mx-auto text-slate-500"
          />

          <h2 className="text-2xl text-white mt-5">
            No matching certificates
          </h2>

        </div>

      ) : (

        <RecentDocuments
          documents={filteredDocuments}
          loading={loading}
          onDelete={handleDelete}
        />

      )}

    </DashboardLayout>
  );
}