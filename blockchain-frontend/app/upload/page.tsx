"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileText,
  Calendar,
  Building2,
  BookOpen,
} from "lucide-react";

import { uploadCertificate } from "../../services/upload";

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  const [certificateType, setCertificateType] = useState("Degree");

  const [issuedBy, setIssuedBy] = useState("");

  const [issueDate, setIssueDate] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a certificate.");
      return;
    }

    if (!title || !certificateType || !issuedBy || !issueDate) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("certificate", file);

      formData.append("title", title);

      formData.append("certificateType", certificateType);

      formData.append("issuedBy", issuedBy);

      formData.append("issueDate", issueDate);

      formData.append("description", description);

      const response = await uploadCertificate(formData);

      alert(response.message);

      setFile(null);
      setTitle("");
      setCertificateType("Degree");
      setIssuedBy("");
      setIssueDate("");
      setDescription("");

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Upload failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">

      {/* Heading */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Upload Certificate
        </h1>

        <p className="text-slate-400 mt-2">
          Upload your academic certificate securely to Blockchain.
        </p>

      </div>

      {/* Upload Card */}

      <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-10">

        {/* Drag Drop */}

        <label
          htmlFor="certificate"
          className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-500 rounded-2xl p-12 cursor-pointer hover:bg-slate-900 transition"
        >

          <UploadCloud
            size={60}
            className="text-cyan-400"
          />

          <h2 className="mt-5 text-2xl font-semibold">

            Drag & Drop Certificate

          </h2>

          <p className="text-slate-400 mt-2">
            or click to browse
          </p>

          {file && (
            <div className="mt-5 flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">

              <FileText className="text-cyan-400" />

              <span>{file.name}</span>

            </div>
          )}

        </label>

        <input
          id="certificate"
          type="file"
          hidden
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(e.target.files[0]);
            }
          }}
        />

        {/* Form */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div>

            <label className="block mb-2 text-slate-300">
              Certificate Title
            </label>

            <div className="flex items-center bg-slate-900 rounded-xl px-4">

              <BookOpen className="text-cyan-400" />

              <input
              type="text"
              placeholder="Certificate Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent p-4 outline-none"
            />

            </div>

          </div>

          <div>

            <label className="block mb-2 text-slate-300">
              Certificate Type
            </label>

            <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                className="w-full bg-slate-900 rounded-xl p-4 outline-none"
            >

              <option>Degree</option>

              <option>Diploma</option>

              <option>Internship</option>

              <option>Workshop</option>

              <option>Course</option>

            </select>

          </div>

          <div>

            <label className="block mb-2 text-slate-300">
              Issued By
            </label>

            <div className="flex items-center bg-slate-900 rounded-xl px-4">

              <Building2 className="text-cyan-400" />

              <input
                type="text"
                placeholder="Institution Name"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                className="w-full bg-transparent p-4 outline-none"
                />

            </div>

          </div>

          <div>

            <label className="block mb-2 text-slate-300">
              Issue Date
            </label>

            <div className="flex items-center bg-slate-900 rounded-xl px-4">

              <Calendar className="text-cyan-400" />

              <input
                type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-transparent p-4 outline-none"
              />

            </div>

          </div>

        </div>

        {/* Description */}

        <div className="mt-6">

          <label className="block mb-2 text-slate-300">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 rounded-xl p-4 outline-none"
          />

        </div>

        {/* Upload Button */}

        <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition rounded-xl py-4 text-lg font-semibold"
        >
            {loading ? "Uploading..." : "Upload Certificate"}
        </button>

      </div>

    </main>
  );
}