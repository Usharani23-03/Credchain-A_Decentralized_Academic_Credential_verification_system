"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  allowedRole: string;
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRole,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user.role) {
      router.push("/login");
      return;
    }

    if (user.role !== allowedRole) {
      router.push("/");
    }
  }, [allowedRole, router]);

  return <>{children}</>;
}