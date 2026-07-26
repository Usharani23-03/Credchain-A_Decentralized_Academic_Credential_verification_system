import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "cyan" | "green" | "yellow" | "red";
}

const colorClasses = {
  cyan: "from-cyan-500 to-blue-600",
  green: "from-green-500 to-emerald-600",
  yellow: "from-yellow-400 to-orange-500",
  red: "from-red-500 to-pink-600",
};

export default function DashboardCard({
  title,
  value,
  icon,
  color,
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r ${colorClasses[color]} p-6 shadow-xl transition hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">{title}</p>

          <h2 className="text-4xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="bg-white/20 p-4 rounded-xl text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}