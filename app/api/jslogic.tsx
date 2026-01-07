import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdmin,
} from "@/app/api/api";

type FetchAdminsParams = {
  setCompanies: Function;
  setTrialCount: Function;
  setLoading: Function;
};

type CreateAdminParams = {
  form: {
    name: string;
    email: string;
    password: string;
  };
  plan: string;
  planType: string;
  isEditMode: boolean;
  setLoading: Function;
  onSuccess: () => void;
  setCompanies: Function;
  setTrialCount: Function;
};

type UpdateAdminParams = {
  adminId: string;
  form: {
    name: string;
    email: string;
  };
  plan: string;
  planType: string;
  setLoading: Function;
  onSuccess: () => void;
  setCompanies: Function;
  setTrialCount: Function;
};

type DeleteAdminParams = {
  adminId: string;
  setLoading: Function;
  setCompanies: Function;
  setTrialCount: Function;
  onSuccess?: () => void;
};

// Mail validation
const isValidGmail = (email: string) => {
  return email.toLowerCase().endsWith("@gmail.com");
};

/* ------------------------------------------------------------------
   FETCH ADMIN HANDLER (LOGIC ONLY)
------------------------------------------------------------------ */
export const fetchAndUpdateAdmins = async ({
  setCompanies,
  setTrialCount,
  setLoading,
}: FetchAdminsParams) => {
  try {
    const res = await getAllAdmins();
    if (!res || !res.success) {
      console.error("❌ API call failed or success=false", res);
      return;
    }
    const admins = res.data;
    const formatted = admins.map((admin: any) => ({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      mobile: admin?.profile?.mobile || "—",
      plan: admin.plan,
      planType: admin.planType || "",
      imageUrl: admin.profile?.image || null,
      address: admin.tracking?.address || "Unknown",
      status: admin.tracking?.status || "inactive",
      updatedAt: admin.tracking?.lastUpdated || "—",
    }));
    setCompanies(formatted);
    if (typeof res.trialCount === "number") {
      setTrialCount(res.trialCount);
    } else {
      const trialUsers = admins.filter(
        (admin: any) => admin.plan === "trial"
      ).length;
      setTrialCount(trialUsers);
    }
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

/* ------------------------------------------------------------------
   ADD ADMIN HANDLER (LOGIC ONLY)
------------------------------------------------------------------ */
export const handleCreateAdmin = async ({
  form,
  plan,
  planType,
  isEditMode,
  setLoading,
  onSuccess,
  setCompanies,
  setTrialCount,
}: CreateAdminParams) => {
  if (!form.name || !form.email || (!isEditMode && !form.password)) {
    return { success: false, message: "❌ Please fill all required fields" };
  }
  if (!isValidGmail(form.email)) {
    return {
      success: false,
      message: "⚠️ Email should have @gmail.com",
    };
  }
  if (!isEditMode) {
    const normalizedPassword = form.password.trim();
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*.])[A-Za-z\d@#&*.]{6,}$/;
    if (!strongPasswordRegex.test(normalizedPassword)) {
      return {
        success: false,
        message:
          "⚠️ Weak Password\n\nPassword must:\n" +
          "• Be at least 6 characters\n" +
          "• Contain uppercase & lowercase letters\n" +
          "• Include a number\n" +
          "• Include a special character (@ # & * .)",
      };
    }
  }
  setLoading(true);
  const res = await createAdmin({
    name: form.name,
    email: form.email,
    password: form.password,
    plan,
    planType,
  });
  setLoading(false);
  if (!res?.success) {
    return {
      success: false,
      message: res?.message || "❌ Failed to create admin",
    };
  }
  await fetchAndUpdateAdmins({
    setCompanies,
    setTrialCount,
    setLoading,
  });
  onSuccess();
  return { success: true, message: "✅ Admin created successfully" };
};

/* ------------------------------------------------------------------
   UPDATE ADMIN HANDLER (LOGIC ONLY)
------------------------------------------------------------------ */
export const handleUpdateAdmin = async ({
  adminId,
  form,
  plan,
  planType,
  setLoading,
  onSuccess,
  setCompanies,
  setTrialCount,
}: UpdateAdminParams) => {
  if (!adminId) {
    return { success: false, message: "❌ Admin ID is required" };
  }
  if (!form.name || !form.email) {
    return { success: false, message: "❌ Name and email are required" };
  }
  if (!isValidGmail(form.email)) {
    return {
      success: false,
      message: "⚠️ Email should have @gmail.com",
    };
  }
  setLoading(true);
  const res = await updateAdmin(adminId, {
    name: form.name,
    email: form.email,
    plan,
    planType,
  });
  setLoading(false);
  if (!res?.success) {
    return {
      success: false,
      message: res?.message || "❌ Failed to update admin",
    };
  }
  await fetchAndUpdateAdmins({
    setCompanies,
    setTrialCount,
    setLoading,
  });
  onSuccess();
  return {
    success: true,
    message: "✅ Admin updated successfully",
  };
};

/* ------------------------------------------------------------------
   DELETE ADMIN HANDLER (LOGIC ONLY)
------------------------------------------------------------------ */
export const handleDeleteAdmin = async ({
  adminId,
  setLoading,
  setCompanies,
  setTrialCount,
  onSuccess,
}: DeleteAdminParams) => {
  if (!adminId) {
    return { success: false, message: "❌ Admin ID is required" };
  }
  const confirmDelete = window.confirm(
    "⚠️ Are you sure you want to delete this admin?"
  );
  if (!confirmDelete) {
    return { success: false, message: "⚠️ Delete cancelled" };
  }
  setLoading(true);
  const res = await deleteAdmin(adminId);
  setLoading(false);
  if (!res?.success) {
    return {
      success: false,
      message: res?.message || "❌ Failed to delete admin",
    };
  }
  await fetchAndUpdateAdmins({
    setCompanies,
    setTrialCount,
    setLoading,
  });
  onSuccess?.();
  return {
    success: true,
    message: "✅ Admin deleted successfully",
  };
};
