import axios from "axios";
import { storage } from "../main/services/storage";

export const API_BASE_URL = "http://localhost:5000";

/* ------------------------------------------------------------------
   AXIOS INSTANCE
------------------------------------------------------------------ */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // required for refresh-token cookie
});

/* ------------------------------------------------------------------
   REQUEST INTERCEPTOR (ATTACH ACCESS TOKEN)
------------------------------------------------------------------ */
api.interceptors.request.use((config: any) => {
  const token = storage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------
   RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN)
------------------------------------------------------------------ */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as any;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      const refresh = await refreshAccessToken();
      if (refresh?.accessToken) {
        originalRequest.headers.Authorization = "Bearer " + refresh.accessToken;
        return api(originalRequest);
      }
      storage.clear();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

/* ------------------------------------------------------------------
   1) LOGIN SUPER ADMIN
------------------------------------------------------------------ */
export const loginSuperAdmin = async (email: string, password: string) => {
  try {
    storage.clear();
    const res = await api.post("/superadminauth/login", {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
    if (res.data?.accessToken) {
      storage.set("accessToken", res.data.accessToken);
    }
    if (res.data?.superAdmin?.id) {
      storage.set("userId", res.data.superAdmin.id);
      storage.set("userRole", "superadmin");
      storage.set("superAdmin", JSON.stringify(res.data.superAdmin));
    }
    return res.data;
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};

/* ------------------------------------------------------------------
   2) SEND OTP
------------------------------------------------------------------ */
export const sendOtp = async (email: string) => {
  try {
    const res = await api.post("/superadminauth/send-otp", {
      email: email.trim().toLowerCase(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Send OTP error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to send OTP",
    };
  }
};

/* ------------------------------------------------------------------
   3) REGISTER SUPER ADMIN
------------------------------------------------------------------ */
export const registerSuperAdmin = async (
  name: string,
  email: string,
  password: string,
  otp: string
) => {
  try {
    const res = await api.post("/superadminauth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      otp: otp.trim(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Register error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed",
    };
  }
};

/* ------------------------------------------------------------------
   4) FORGOT PASSWORD
------------------------------------------------------------------ */
export const forgotSuperAdminPassword = async (email: string) => {
  try {
    const res = await api.post("/superadminauth/forgot-password", {
      email: email.trim().toLowerCase(),
    });
    return res.data; // { success, message, token, validFor }
  } catch (err: any) {
    console.error("Forgot password error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to process request",
    };
  }
};

/* ------------------------------------------------------------------
   5) RESET PASSWORD
------------------------------------------------------------------ */
export const resetSuperAdminPassword = async (
  token: string,
  password: string
) => {
  try {
    const res = await api.post("/superadminauth/reset-password", {
      token,
      password: password.trim(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Reset password error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Password reset failed",
    };
  }
};

/* ------------------------------------------------------------------
   6) REFRESH ACCESS TOKEN
------------------------------------------------------------------ */
export const refreshAccessToken = async () => {
  try {
    const res = await api.post("/superadminauth/refresh-token");
    if (res.data?.accessToken) {
      storage.set("accessToken", res.data.accessToken);
    }
    return res.data;
  } catch {
    storage.clear();
    return null;
  }
};

/* ------------------------------------------------------------------
   7) VALIDATE ACCESS TOKEN
------------------------------------------------------------------ */
export const validateAccessToken = async () => {
  try {
    const res = await api.get("/superadminauth/validate");
    return res.data;
  } catch {
    return { valid: false };
  }
};

/* ------------------------------------------------------------------
   8) GET ALL ADMINS (SUPER ADMIN)
------------------------------------------------------------------ */
export const getAllAdmins = async () => {
  try {
    const res = await api.get("/superadmin"); // <-- matches router.get("/")
    return {
      success: true,
      count: res.data.count,
      trialCount: res.data.trialCount,
      data: res.data.data, // mergedAdmins
    };
  } catch (err: any) {
    console.error(
      "❌ Error fetching admins:",
      err.response?.data || err.message
    );
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch admins",
      data: [],
    };
  }
};

/* ------------------------------------------------------------------
   9) CREATE ADMIN (SUPER ADMIN)
------------------------------------------------------------------ */
export const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
  plan: string;
  planType?: string;
}) => {
  try {
    const res = await api.post("/superadmin", {
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      plan: payload.plan,
      planType: payload.plan === "trial" ? undefined : payload.planType,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Create admin error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create admin",
    };
  }
};

/* ------------------------------------------------------------------
   10) UPDATE ADMIN (SUPER ADMIN)
------------------------------------------------------------------ */
export const updateAdmin = async (
  adminId: string,
  payload: {
    name?: string;
    email?: string;
    plan?: string;
    planType?: string;
  }
) => {
  try {
    const body: any = {};
    if (payload.name) body.name = payload.name.trim();
    if (payload.email) body.email = payload.email.trim();
    if (payload.plan) body.plan = payload.plan;
    if (payload.plan && payload.plan !== "trial") {
      body.planType = payload.planType || "monthly";
    }
    const res = await api.put(`/superadmin/${adminId}`, body);
    return res.data;
  } catch (err: any) {
    console.error("❌ Update admin error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update admin",
    };
  }
};

/* ------------------------------------------------------------------
   11) DELETE ADMIN (SUPER ADMIN)
------------------------------------------------------------------ */
export const deleteAdmin = async (adminId: string) => {
  try {
    const res = await api.delete(`/superadmin/${adminId}`);
    return {
      success: true,
      message: res.data?.message || "Admin deleted successfully",
    };
  } catch (err: any) {
    console.error(
      "❌ Error deleting admin:",
      err.response?.data || err.message
    );
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete admin",
    };
  }
};

export default api;
