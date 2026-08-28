"use client";

import { useState } from "react";

import {
  UploadCloud,
  FileText,
  Calendar,
  Building2,
  BookOpen,
  QrCode,
  ShieldCheck,
  User
} from "lucide-react";

import RoleGuard from "@/components/auth/RoleGuard";

import { uploadCertificate } from "../../../services/upload";


export default function UploadPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [title, setTitle] =
    useState("");

  const [certificateType, setCertificateType] =
    useState("Degree");

  const [issuedBy, setIssuedBy] =
    useState("");

  const [issueDate, setIssueDate] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [studentEmail, setStudentEmail] =
    useState("");

  const [hasExistingQR, setHasExistingQR] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);


  const handleUpload = async () => {

    if (!file) {

      alert(
        "Please select a certificate."
      );

      return;
    }


    if (file.type !== "application/pdf") {

      alert(
        "Please upload a PDF certificate."
      );

      return;
    }


    if (
      !title ||
      !certificateType ||
      !issuedBy ||
      !issueDate ||
      !studentEmail
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    try {

      setLoading(true);

      setResult(null);


      const formData =
        new FormData();


      formData.append(
        "certificate",
        file
      );


      formData.append(
        "title",
        title
      );


      formData.append(
        "certificateType",
        certificateType
      );


      formData.append(
        "issuedBy",
        issuedBy
      );


      formData.append(
        "issueDate",
        issueDate
      );


      formData.append(
        "description",
        description
      );


      formData.append(
        "studentEmail",
        studentEmail.trim().toLowerCase()
      );


      formData.append(
        "hasExistingQR",
        hasExistingQR
          ? "true"
          : "false"
      );


      const response =
        await uploadCertificate(
          formData
        );


      setResult(response);


      alert(
        response.message ||
        "Certificate issued successfully."
      );


      setFile(null);

      setTitle("");

      setCertificateType(
        "Degree"
      );

      setIssuedBy("");

      setIssueDate("");

      setDescription("");

      setStudentEmail("");

      setHasExistingQR(false);


    } catch (error: any) {

      console.error(
        "Certificate upload error:",
        error
      );


      alert(
        error?.response?.data?.message ||
        "Upload failed."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <RoleGuard allowedRole="UNIVERSITY">

      <main className="min-h-screen bg-[#020617] text-white p-10">

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Issue Certificate
          </h1>

          <p className="text-slate-400 mt-2">
            Issue academic certificates securely using
            Blockchain and CredChain.
          </p>

        </div>


        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-10">


          {/* ================================================= */}
          {/* Certificate Upload */}
          {/* ================================================= */}

          <label
            htmlFor="certificate"
            className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-500 rounded-2xl p-12 cursor-pointer hover:bg-slate-900 transition"
          >

            <UploadCloud
              size={60}
              className="text-cyan-400"
            />

            <h2 className="mt-5 text-2xl font-semibold">
              Upload Certificate File
            </h2>

            <p className="text-slate-400 mt-2">
              Upload a PDF certificate
            </p>

            {file && (

              <div className="mt-5 flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">

                <FileText
                  className="text-cyan-400"
                />

                <span>
                  {file.name}
                </span>

              </div>

            )}

          </label>


          <input
            id="certificate"
            type="file"
            hidden
            accept=".pdf,application/pdf"
            onChange={(e) => {

              const selectedFile =
                e.target.files?.[0];


              if (!selectedFile) {
                return;
              }


              if (
                selectedFile.type !==
                "application/pdf"
              ) {

                alert(
                  "Please select a PDF certificate."
                );

                e.target.value = "";

                return;

              }


              setFile(
                selectedFile
              );

            }}
          />


          {/* ================================================= */}
          {/* Student Assignment */}
          {/* ================================================= */}

          <div className="mt-8 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-6">

            <div className="flex items-start gap-4">

              <div className="p-3 rounded-xl bg-cyan-500/10">

                <User
                  size={28}
                  className="text-cyan-400"
                />

              </div>


              <div>

                <h3 className="text-lg font-semibold">
                  Assign Certificate to Student
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Enter the email address of the student
                  who should receive this certificate.
                </p>

              </div>

            </div>


            <div className="mt-5">

              <label className="block mb-2 text-slate-300">
                Student Email
              </label>


              <div className="flex items-center bg-slate-900 rounded-xl px-4 border border-slate-700">

                <User
                  className="text-cyan-400"
                />


                <input
                  type="email"
                  placeholder="student@example.com"
                  value={studentEmail}
                  onChange={(e) =>
                    setStudentEmail(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>


              <p className="text-xs text-slate-500 mt-2">
                The student must already have a CredChain
                account with this email address.
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* QR Configuration */}
          {/* ================================================= */}

          <div className="mt-8 bg-slate-900/70 border border-slate-700 rounded-2xl p-6">

            <div className="flex items-start gap-4">

              <div className="p-3 rounded-xl bg-cyan-500/10">

                <QrCode
                  size={28}
                  className="text-cyan-400"
                />

              </div>


              <div>

                <h3 className="text-lg font-semibold">
                  Certificate QR Code
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Tell CredChain whether the uploaded
                  certificate already contains a QR code.
                </p>

              </div>

            </div>


            <div className="mt-5 space-y-4">


              {/* Existing QR */}

              <label
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  hasExistingQR
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >

                <input
                  type="radio"
                  name="qrOption"
                  checked={hasExistingQR}
                  onChange={() =>
                    setHasExistingQR(true)
                  }
                  className="mt-1"
                />


                <div>

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={20}
                      className="text-cyan-400"
                    />

                    <span className="font-medium">
                      Certificate already has a QR
                    </span>

                  </div>

                  <p className="text-sm text-slate-400 mt-1">
                    Preserve the existing QR code.
                    CredChain will not modify the
                    certificate PDF.
                  </p>

                </div>

              </label>


              {/* Generate QR */}

              <label
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  !hasExistingQR
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >

                <input
                  type="radio"
                  name="qrOption"
                  checked={!hasExistingQR}
                  onChange={() =>
                    setHasExistingQR(false)
                  }
                  className="mt-1"
                />


                <div>

                  <div className="flex items-center gap-2">

                    <QrCode
                      size={20}
                      className="text-cyan-400"
                    />

                    <span className="font-medium">
                      Generate CredChain QR
                    </span>

                  </div>

                  <p className="text-sm text-slate-400 mt-1">
                    CredChain will generate a
                    certificate ID and QR code.
                  </p>

                </div>

              </label>

            </div>

          </div>


          {/* ================================================= */}
          {/* Certificate Details */}
          {/* ================================================= */}

          <div className="grid md:grid-cols-2 gap-6 mt-10">


            <div>

              <label className="block mb-2 text-slate-300">
                Certificate Title
              </label>

              <div className="flex items-center bg-slate-900 rounded-xl px-4">

                <BookOpen
                  className="text-cyan-400"
                />

                <input
                  type="text"
                  placeholder="Certificate Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
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
                onChange={(e) =>
                  setCertificateType(
                    e.target.value
                  )
                }
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

                <Building2
                  className="text-cyan-400"
                />

                <input
                  type="text"
                  placeholder="Institution Name"
                  value={issuedBy}
                  onChange={(e) =>
                    setIssuedBy(e.target.value)
                  }
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>

            </div>


            <div>

              <label className="block mb-2 text-slate-300">
                Issue Date
              </label>

              <div className="flex items-center bg-slate-900 rounded-xl px-4">

                <Calendar
                  className="text-cyan-400"
                />

                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) =>
                    setIssueDate(e.target.value)
                  }
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* Description */}
          {/* ================================================= */}

          <div className="mt-6">

            <label className="block mb-2 text-slate-300">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Enter certificate description..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full bg-slate-900 rounded-xl p-4 outline-none"
            />

          </div>


          {/* ================================================= */}
          {/* Issue Button */}
          {/* ================================================= */}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition rounded-xl py-4 text-lg font-semibold"
          >

            {loading
              ? "Issuing..."
              : "Issue Certificate"}

          </button>


          {/* ================================================= */}
          {/* Success Information */}
          {/* ================================================= */}

          {result && (

            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">

              <h3 className="text-xl font-semibold text-emerald-400">
                Certificate Issued Successfully
              </h3>


              {result.certificateId && (

                <p className="mt-3 text-slate-300">

                  <span className="font-semibold">
                    Certificate ID:
                  </span>{" "}

                  {result.certificateId}

                </p>

              )}


              {result.student && (

                <p className="mt-2 text-slate-300">

                  <span className="font-semibold">
                    Student:
                  </span>{" "}

                  {result.student.name}

                  {" ("}

                  {result.student.email}

                  {")"}

                </p>

              )}


              {result.verificationURL && (

                <p className="mt-2 text-slate-300 break-all">

                  <span className="font-semibold">
                    Verification URL:
                  </span>{" "}

                  {result.verificationURL}

                </p>

              )}


              {result.qrGenerated !== undefined && (

                <p className="mt-2 text-slate-300">

                  <span className="font-semibold">
                    CredChain QR:
                  </span>{" "}

                  {result.qrGenerated
                    ? "Generated"
                    : "Existing QR preserved"}

                </p>

              )}

            </div>

          )}

        </div>

      </main>

    </RoleGuard>

  );

}