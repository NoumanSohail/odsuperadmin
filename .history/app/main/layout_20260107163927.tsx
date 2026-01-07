"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.get("accessToken");

      // ❌ Not logged in → go to login
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await validateAccessToken();

      // ❌ Invalid token → clear & login
      if (!res?.valid) {
        storage.clear();
        router.replace("/auth/login");
        return;
      }

      // ✅ Logged in but landed on /main → send to dashboard
      if (pathname === "/main") {
        router.replace("/main/dashboard");
        return;
      }

      // ✅ Auth OK → render content
      setCheckingAuth(false);
    };

    checkAuth();
  }, [router, pathname]);

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
