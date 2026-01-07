"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar/Navbar";
import { validateAccessToken } from "@/app/api/api";
import { storage } from "@/app/main/services/storage";
import Skeleton from "../components/Skeleton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.get("accessToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      const res = await validateAccessToken();
      if (!res?.valid) {
        storage.clear();
        router.replace("/auth/login");
        return;
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full bg-(--color-bg)">
        <div className="flex-1">
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex">
      {/* SIDEBAR */}
        <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto bg-(--color-bg)">
        {children}
      </main>
    </div>
  );
}
