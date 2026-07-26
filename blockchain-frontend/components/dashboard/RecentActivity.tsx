"use client";

import {
    CheckCircle2,
    Upload,
    ShieldCheck,
} from "lucide-react";

const activities = [

    {
        title: "Certificate Uploaded",
        time: "2 mins ago",
        icon: Upload,
    },

    {
        title: "Certificate Verified",
        time: "20 mins ago",
        icon: ShieldCheck,
    },

    {
        title: "Login Successful",
        time: "Today",
        icon: CheckCircle2,
    },

];

export default function RecentActivity() {

    return (

        <div className="bg-[#0F172A] rounded-3xl p-8 border border-slate-800">

            <h2 className="text-2xl font-bold text-white mb-8">

                Recent Activity

            </h2>

            <div className="space-y-6">

                {activities.map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.title}
                            className="flex gap-4 items-center"
                        >

                            <div className="bg-cyan-500 p-3 rounded-xl">

                                <Icon className="text-white" />

                            </div>

                            <div>

                                <h3 className="text-white font-semibold">

                                    {item.title}

                                </h3>

                                <p className="text-slate-400">

                                    {item.time}

                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}