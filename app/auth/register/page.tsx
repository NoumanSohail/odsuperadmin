"use client";

import Button from "@/app/components/Button";
import InputBox from "@/app/components/InputBox";
import Logoheader from "@/app/components/Logoheader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import { sendOtp, registerSuperAdmin } from "@/app/api/api";

const register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------------- SEND OTP ---------------------- */
  const handleSendOtp = async () => {
    if (!form.email) {
      alert("❌ Please enter your email");
      return;
    }
    try {
      setOtpLoading(true);
      const res = await sendOtp(form.email);
      if (res.success) {
        setOtpSent(true);
        alert("✅ " + res.message);
      } else {
        alert("❌ " + (res.message || "Failed to send OTP"));
      }
    } catch (error: any) {
      alert("❌ " + (error.message || "Something went wrong"));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ---------------------- REGISTER ---------------------- */
  const handleRegister = async () => {
    const { name, email, password, otp } = form;
    if (!name || !email || !password || !otp) {
      alert("❌ All fields are required");
      return;
    }
    const normalizedPassword = password.trim();
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;
    if (!strongPasswordRegex.test(normalizedPassword)) {
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
      const res = await registerSuperAdmin(
        name.trim(),
        email.trim(),
        normalizedPassword,
        otp.trim()
      );
      if (res.success) {
        alert("✅ " + res.message);
        router.replace("/auth/login");
      } else {
        alert("❌ " + (res.message || "Unable to register"));
      }
    } catch (error: any) {
      alert("❌ " + (error.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-(--color-sidebar)">
      <div className="bg-(--color-bg) flex flex-col items-center justify-center rounded-2xl shadow-md sm:w-[60%] md:w-[50%] lg:w-[30%]">
        <form
          className="flex flex-col w-full h-full p-10 gap-8 md:gap-15 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <Logoheader title="Register" />

          <div className="flex flex-col w-full gap-3">
            <InputBox
              icon={<FaUser size={20} />}
              type="text"
              placeholder="Enter name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              autoCapitalize="words"
              required
            />

            <InputBox
              icon={<TbMailFilled size={24} />}
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              autoCapitalize="none"
              required
            />

            <div className="md:flex items-center justify-between">
              <InputBox
                icon={<IoShieldCheckmark size={24} />}
                type="number"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(value) => updateField("otp", value)}
                inputMode="numeric"
                required
              />

              <div className="flex mt-3 md:mt-0 w-full items-center justify-center">
                <div className="w-[50%] md:w-[90%]">
                  <Button
                    title={otpLoading ? "Please wait..." : "Get OTP"}
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                  />
                </div>
              </div>
            </div>

            <InputBox
              icon={<MdLock size={26} />}
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(value) => updateField("password", value)}
              autoCapitalize="sentences"
              required
            />
          </div>

          <div className="flex flex-col w-full gap-3 md:gap-5 mt-auto">
            <Button
              title={loading ? "Registering..." : "Register"}
              onClick={handleRegister}
              disabled={loading}
            />
            <div className="flex justify-center w-full font-medium">
              <Link href="/auth/login">
                <div>
                  Already have an account?
                  <span className="text-(--color-primary)"> Login</span>
                </div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default register;
