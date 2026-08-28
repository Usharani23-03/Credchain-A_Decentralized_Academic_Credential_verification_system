"use client";

import {
  useEffect,
  useState
} from "react";

import DashboardLayout from
  "@/components/layout/DashboardLayout";

import DashboardCard from
  "@/components/dashboard/DashboardCard";

import QuickActions from
  "@/components/dashboard/QuickActions";

import RoleGuard from
  "@/components/auth/RoleGuard";

import {
  getStudentDashboard
} from "@/services/dashboard";


import {
  Award,
  CheckCircle,
  Clock,
  Building2
} from "lucide-react";


export default function StudentDashboard() {

  const [data, setData] =
    useState<any>({
      totalCertificates: 0,
      verifiedCertificates: 0,
      pendingCertificates: 0,
      documents: []
    });


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);


          const result =
            await getStudentDashboard();


          console.log(
            "Student dashboard:",
            result
          );


          setData(result);


        } catch (error) {

          console.error(
            "Failed to fetch dashboard data",
            error
          );


        } finally {

          setLoading(false);

        }

      };


    fetchDashboard();


  }, []);


  return (

    <RoleGuard allowedRole="STUDENT">

      <DashboardLayout>

        <h1 className="text-3xl font-bold text-white mb-8">

          Student Dashboard

        </h1>


        {/* ========================================= */}
        {/* Statistics */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <DashboardCard

            title="My Credentials"

            value={
              data.totalCertificates
            }

            icon={
              <Award size={30} />
            }

            color="cyan"

          />


          <DashboardCard

            title="Verified Credentials"

            value={
              data.verifiedCertificates
            }

            icon={
              <CheckCircle
                size={30}
              />
            }

            color="green"

          />


          <DashboardCard

            title="Pending Verification"

            value={
              data.pendingCertificates
            }

            icon={
              <Clock
                size={30}
              />
            }

            color="yellow"

          />

        </div>


        {/* ========================================= */}
        {/* Credentials */}
        {/* ========================================= */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-white mb-5">

            My Credentials

          </h2>


          {loading && (

            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">

              <p className="text-slate-400">

                Loading credentials...

              </p>

            </div>

          )}


          {!loading &&
            data.documents &&
            data.documents.length === 0 && (

              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8">

                <Award

                  size={45}

                  className="text-slate-600 mb-4"

                />


                <h3 className="text-xl font-semibold text-white">

                  No credentials yet

                </h3>


                <p className="text-slate-400 mt-2">

                  Credentials issued to your
                  CredChain account by an
                  authorized institution will
                  appear here.

                </p>

              </div>

            )}


          {!loading &&
            data.documents &&
            data.documents.length > 0 && (

              <div className="space-y-4">

                {data.documents.map(
                  (document: any) => (

                    <div

                      key={document.id}

                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6"

                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                          <div className="flex items-center gap-3">

                            <Award

                              className="text-cyan-400"

                              size={28}

                            />


                            <h3 className="text-xl font-semibold text-white">

                              {document.title}

                            </h3>

                          </div>


                          <div className="flex items-center gap-2 mt-3 text-slate-400">

                            <Building2
                              size={18}
                            />


                            <span>

                              Issued by:{" "}

                              {document.issuedBy}

                            </span>

                          </div>


                          <p className="text-slate-400 mt-2">

                            Credential Type:{" "}

                            {document.certificateType}

                          </p>


                          {document.certificateId && (

                            <p className="text-slate-500 text-sm mt-2">

                              Certificate ID:{" "}

                              {document.certificateId}

                            </p>

                          )}

                        </div>


                        <div>

                          {document.verificationStatus ===
                          "VERIFIED" ? (

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">

                              <CheckCircle
                                size={18}
                              />

                              Verified

                            </span>


                          ) : document.verificationStatus ===
                          "PENDING" ? (

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">

                              <Clock
                                size={18}
                              />

                              Pending

                            </span>


                          ) : (

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">

                              Rejected

                            </span>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </div>


        <QuickActions
          role="STUDENT"
        />

      </DashboardLayout>

    </RoleGuard>

  );

}