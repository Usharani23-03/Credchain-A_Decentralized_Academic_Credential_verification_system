"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getVerificationHistory } from "@/services/document";

interface HistoryItem {
  id: number;
  status: string;
  verifiedAt: string;
  document: {
    title: string;
    issuedBy: string;
    certificateType: string;
  };
}

export default function VerificationHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const response = await getVerificationHistory();

      setHistory(response.history || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Verification History
        </h1>

        <p className="text-slate-400 mt-2">
          View all certificates verified by you.
        </p>
      </div>

      {loading ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-white">
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10">
          <h2 className="text-xl text-white">
            No verification history available.
          </h2>

          <p className="text-slate-400 mt-2">
            Verified certificates will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-slate-300">
                  Certificate
                </th>

                <th className="px-6 py-4 text-slate-300">
                  Type
                </th>

                <th className="px-6 py-4 text-slate-300">
                  Issued By
                </th>

                <th className="px-6 py-4 text-slate-300">
                  Status
                </th>

                <th className="px-6 py-4 text-slate-300">
                  Verified On
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-800"
                >
                  <td className="px-6 py-4 text-white">
                    {item.document.title}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {item.document.certificateType}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {item.document.issuedBy}
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-white text-sm">
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {new Date(item.verifiedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}