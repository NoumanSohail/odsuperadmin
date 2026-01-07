"use client";

import Link from "next/link";
import Button from "@/app/components/Button";
import { useState } from "react";
import Logoheader from "@/app/components/Logoheader";
import InputBox from "@/app/components/InputBox";
import { TbMailFilled } from "react-icons/tb";
import { MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import { loginSuperAdmin } from "@/app/api/api";
import { storage } from "@/app/main/services/storage";

const page = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("❌ Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const data = await loginSuperAdmin(form.email, form.password);
      if (!data.success) {
        alert("❌ " + data.message || "Invalid email or password");
        return;
      }
      storage.set("accessToken", data.accessToken);
      storage.set("userRole", "superadmin");
      storage.set("superAdmin", JSON.stringify(data.superAdmin));
      alert("✅ Login successful!");
      router.replace("/main");
    } catch (err: any) {
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-(--color-sidebar)">
      <div className="bg-(--color-bg) flex flex-col items-center justify-center rounded-2xl shadow-md sm:w-[70%] md:w-[50%] lg:w-[30%]">
        <form
          className="flex flex-col w-full h-full p-10 gap-8 md:gap-15 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Logoheader title="Login" />

          <div className="flex flex-col w-full gap-3">
            <InputBox
              icon={<TbMailFilled size={24} />}
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              autoCapitalize="none"
              required
            />

            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              autoCapitalize="sentences"
              required
            />

            <div className="flex justify-end w-full font-medium">
              <Link href="/auth/forgotpassword">Forgot Password?</Link>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
            <Button
              title={loading ? "Logging in..." : "Login"}
              onClick={handleLogin}
              disabled={loading}
            />
            <div className="flex justify-center w-full font-medium">
              <Link href="/auth/register">
                <div>
                  Don't have an account?
                  <span className="text-(--color-primary)"> Register</span>
                </div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
