"use client";

import Link from "next/link";
import {
  Upload,
  FileText,
  Search,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Upload Certificate",
    description: "Upload a new certificate to Blockchain",
    href: "/upload",
    icon: Upload,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "My Documents",
    description: "View uploaded certificates",
    href: "/documents",
    icon: FileText,
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Verify Certificate",
    description: "Verify certificate authenticity",
    href: "/verify",
    icon: Search,
    color: "from-emerald-500 to-green-600",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <span className="text-slate-400">
          Manage certificates faster
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group rounded-3xl bg-gradient-to-r ${action.color}
              p-6 shadow-xl hover:scale-105 transition duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="bg-white/20 rounded-2xl p-4">
                  <Icon
                    size={34}
                    className="text-white"
                  />
                </div>

                <ArrowRight
                  className="text-white group-hover:translate-x-2 transition"
                  size={26}
                />
              </div>

              <h3 className="mt-8 text-2xl font-bold text-white">
                {action.title}
              </h3>

              <p className="mt-3 text-white/80">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}