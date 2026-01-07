"use client";

import Button from "@/app/components/Button";
import InputBox from "@/app/components/InputBox";
import Logoheader from "@/app/components/Logoheader";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdLock } from "react-icons/md";
import { resetSuperAdminPassword } from "@/app/api/api";

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = async () => {
    const { password, confirmPassword } = form;

    if (!token) {
      alert("❌ Invalid or expired reset link");
      return;
    }

    if (!password || !confirmPassword) {
      alert("❌ All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      alert(
        "❌ Weak Password\n\nPassword must:\n" +
          "• Be at least 6 characters\n" +
          "• Contain uppercase & lowercase letters\n" +
          "• Include a number\n" +
          "• Include a special character (@ # & * .)"
      );
      return;
    }

    try {
      setLoading(true);
      const res = await resetSuperAdminPassword(token, password);
      if (res.success) {
        alert("✅ " + res.message);
        router.replace("/auth/login");
      } else {
        alert("❌ " + (res.message || "Unable to reset password"));
      }
    } catch {
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-(--color-sidebar)">
      <div className="bg-(--color-bg) flex flex-col items-center justify-center rounded-2xl shadow-md sm:w-[70%] md:w-[50%] lg:w-[30%]">
        <form
          className="flex flex-col w-full h-full p-10 gap-8 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Logoheader title="Reset Password" />

          <div className="flex flex-col w-full gap-3">
            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              required
            />
            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(v) => handleChange("confirmPassword", v)}
              required
            />
          </div>

          <Button
            title={loading ? "Please wait..." : "Reset Password"}
            onClick={handleReset}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
