"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5555/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users);
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
          User Management
        </h1>

        <p className="text-slate-400 mt-2">
          View all registered users.
        </p>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">

        {loading ? (

          <div className="p-8 text-white">
            Loading...
          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="text-left px-6 py-4 text-slate-300">
                  Name
                </th>

                <th className="text-left px-6 py-4 text-slate-300">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-slate-300">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-slate-300">
                  Joined
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t border-slate-800"
                >

                  <td className="px-6 py-4 text-white">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-cyan-600 px-3 py-1 rounded-full text-white text-sm">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </DashboardLayout>
  );
}