"use client";

import Button from "@/app/components/Button";
import DashboardCard from "@/app/components/Dashboardcard";
import {
  MdCardGiftcard,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdLock,
  MdOutlineSubscriptions,
  MdPayment,
  MdSearch,
  MdWarning,
} from "react-icons/md";
import { useEffect, useState } from "react";
import Crosicon from "@/app/components/Crosicon";
import { HiPlus } from "react-icons/hi";
import Image from "next/image";
import Goicon from "@/app/components/Goicon";
import InputBox from "@/app/components/InputBox";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaRegSmile,
  FaUser,
} from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  fetchAndUpdateAdmins,
  handleCreateAdmin,
  handleDeleteAdmin,
  handleUpdateAdmin,
} from "@/app/api/jslogic";
import { AiFillWarning } from "react-icons/ai";
import { HiExclamationTriangle } from "react-icons/hi2";
import About from "../caution/Caution";
import Caution from "../caution/Caution";

const page = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [planIsOpen, setPlanIsOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState("trial");
  const [planTypeIsOpen, setPlanTypeIsOpen] = useState(false);
  const [planTypeFilter, setPlanTypeFilter] = useState("monthly");
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trialCount, setTrialCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [viewDetails, setViewDetails] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const planOptions = [
    { value: "trial", label: "Trial", price: "rs - 0/-" },
    { value: "silver", label: "Silver", price: "rs - 299/-" },
    { value: "gold", label: "Gold", price: "rs - 399/-" },
    { value: "diamond", label: "Diamond", price: "rs - 499/-" },
  ];
  const planTypeOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Fetch admins with tracking data
  useEffect(() => {
    fetchAndUpdateAdmins({
      setCompanies,
      setTrialCount,
      setLoading,
    });

    const interval = setInterval(() => {
      console.log("fetching data every 5 sec once");
      fetchAndUpdateAdmins({
        setCompanies,
        setTrialCount,
        setLoading,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitClick = async () => {
    if (isEditMode) {
      const res = await handleUpdateAdmin({
        adminId: editingAdmin._id,
        form,
        plan: planFilter,
        planType: planTypeFilter,
        setLoading,
        setCompanies,
        setTrialCount,
        onSuccess: () => {
          setIsAddAdminOpen(false);
          resetAdminForm();
          alert("✅ Admin updated successfully");
        },
      });

      if (!res.success) alert(res.message);
    } else {
      const res = await handleCreateAdmin({
        form,
        plan: planFilter,
        planType: planTypeFilter,
        isEditMode,
        setLoading,
        setCompanies,
        setTrialCount,
        onSuccess: () => {
          setIsAddAdminOpen(false);
          resetAdminForm();
          alert("✅ Admin created successfully");
        },
      });

      if (!res.success) alert(res.message);
    }
  };

  const handleDeleteAdminClick = async () => {
    // ❌ Safety checks
    if (!viewDetails?._id) return;

    // ❌ Name mismatch protection
    if (confirmName.trim() !== viewDetails.name) {
      setDeleteError("Admin name does not match");
      setShakeKey((prev) => prev + 1); // 🔥 THIS is what triggers shake
      return;
    }

    setDeleteError("");
    setLoading(true);

    const res = await handleDeleteAdmin({
      adminId: viewDetails._id,
      setLoading,
      setCompanies,
      setTrialCount,
      onSuccess: () => {
        setSelectedCompany(false);
        setIsDeleteOpen(false);
        setConfirmName("");

        alert("✅ Admin deleted successfully");
      },
    });

    if (!res?.success) {
      alert(res?.message || "Failed to delete admin");
    }
  };

  useEffect(() => {
    let result = [...companies];

    // 🔍 Filter by name (search)
    if (searchText.trim() !== "") {
      result = result.filter(
        (c: any) =>
          c.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 🟢 Filter by status
    if (statusFilter !== "all") {
      result = result.filter((c: any) => c.status === statusFilter);
    }

    // Trial filter
    if (planFilter === "trial") {
      setPlanTypeIsOpen(false);
    }

    setFilteredCompanies(result);
  }, [companies, searchText, statusFilter, planFilter]);

  const resetAdminForm = () => {
    setIsEditMode(false);
    setEditingAdmin(null);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setPlanFilter("trial");
    setPlanTypeFilter("");
    setPlanIsOpen(false);
    setPlanTypeIsOpen(false);
  };

  const getPlanLabel = (plan: string) =>
    planOptions.find((p) => p.value === plan)?.label || "Trial";

  const getPlanPrice = (plan: string) =>
    planOptions.find((p) => p.value === plan)?.price || "rs - 0/-";

  const getPlanTypeLabel = (plan: string, planType: string) => {
    if (plan === "trial") return "Not applicable";
    return (
      planTypeOptions.find((p) => p.value === planType)?.label || "Monthly"
    );
  };

  return (
    <div className="flex flex-col h-screen w-full p-5 gap-5">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-full text-center md:text-left">
            <h1 className="hidden md:block text-2xl font-semibold text-(--color-primary)">
              Welcome to the Dashboard
            </h1>
            <h1 className="block md:hidden text-xl font-semibold text-(--color-primary)">
              Welcome to the Dashboard
            </h1>
          </div>

          <Button
            title="Add Admin"
            onClick={() => setIsAddAdminOpen(true)}
            icon={<HiPlus size={24} />}
            className="hidden md:flex xl:w-[20%] lg:w-[30%] md:w-[40%] 
            [&_.button-icon]:transition-transform
            [&_.button-icon]:duration-500
            hover:[&_.button-icon]:rotate-180"
          />
        </div>

        <div className="flex xl:pl-[23%] lg:pl-[35%] md:pl-[40%] pl-[50%]">
          __Admin for Admin
        </div>

        <div className="flex md:hidden w-full justify-end items-center mt-4">
          <div className="w-[50%]">
            <Button
              title="Add Admin"
              icon={<HiPlus size={24} />}
              onClick={() => setIsAddAdminOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="flex flex-col md:flex-row gap-5">
        <DashboardCard
          title="Total number of subscriptions"
          icon={<MdOutlineSubscriptions size={22} />}
          value={companies.length}
        />
        <DashboardCard
          title="Total number of paid users"
          icon={<MdPayment size={22} />}
          value={companies.length - trialCount}
        />
        <DashboardCard
          title="Total number of free users"
          icon={<MdCardGiftcard size={22} />}
          value={trialCount}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-5 w-full h-12">
        {/* SEARCH */}
        <div className=" group flex items-center w-[60%] md:w-full bg-(--color-sidebar) text-(--color-gray) rounded-2xl shadow-lg px-3 py-2 text-[18px] font-semibold">
          <MdSearch size={30} className="search-icon transition-transform" />

          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="ml-2 w-full outline-none bg-transparent"
          />
        </div>

        {/* STATUS DROPDOWN */}
        <div className="w-[45%] md:w-[30%] lg:w-[20%] xl:w-[15%]">
          <button
            className="w-full bg-(--color-sidebar) text-(--color-gray) font-medium p-2.5 rounded-2xl shadow-lg flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {statusOptions.find((o) => o.value === statusFilter)?.label}
            <MdKeyboardArrowDown
              size={30}
              className={`transition-transform duration-200 ${
                isOpen ? "flex rotate-180 scale-130 text-(--color-primary)" : ""
              }`}
            />
          </button>

          {/* STATUS OPTIONS */}
          {isOpen && (
            <div className="relative mt-2 w-full md:bg-(--color-sidebar) bg-[#faf6ff] rounded-2xl shadow-xl p-3 pb-1">
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-lg cursor-pointer mb-2 hover:bg-(--color-secondary)
                    ${
                      statusFilter === option.value
                        ? "bg-(--color-secondary)"
                        : ""
                    }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= DESKTOP UI ================= */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCompanies.length === 0 ? (
          <p className="text-(--color-gray) font-medium px-5">
            No data available
          </p>
        ) : (
          filteredCompanies.map((c: any) => (
            <div
              key={c._id}
              className="flex flex-col bg-(--color-sidebar)
                   hover:bg-[#f2edff] hover:text-black
                   rounded-3xl shadow-lg p-4
                   transition
                   hover:scale-105 hover:rotate-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <Image
                  src={c.imageUrl || "/default-profile.png"}
                  alt={c.name}
                  width={64}
                  height={64}
                  className="object-cover h-16 w-16 rounded-xl"
                  unoptimized={Boolean(c.imageUrl?.startsWith("data:"))}
                />

                <Goicon
                  onClick={() => {
                    setViewDetails(c);
                    setSelectedCompany(true);
                  }}
                />
              </div>

              {/* Body */}
              <div className="mt-2 flex flex-col gap-1 overflow-hidden text-(--color-gray)">
                <p className="text-lg font-bold text-black truncate">
                  {c.name}
                </p>

                <span
                  className={`px-3 py-1 rounded-full font-semibold w-fit
              ${
                c.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                >
                  {c.status[0].toUpperCase() + c.status.slice(1)}
                </span>

                <p className="truncate">{c.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MOBILE UI ================= */}
      <div className="grid md:hidden gap-4">
        {filteredCompanies.length === 0 ? (
          <p className="text-(--color-gray) font-medium px-5">
            No data available
          </p>
        ) : (
          filteredCompanies.map((c: any) => (
            <div
              key={c._id}
              className="flex items-center gap-5 bg-(--color-sidebar) rounded-3xl shadow-lg p-3"
            >
              <Image
                src={c.imageUrl || "/default-profile.png"}
                alt={c.name}
                width={64}
                height={64}
                className="object-cover h-16 w-16 rounded-xl"
                unoptimized={Boolean(c.imageUrl?.startsWith("data:"))}
              />

              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{c.name}</p>
                <p className="text-sm text-gray-500 truncate">{c.email}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold
                ${
                  c.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                >
                  {c.status[0].toUpperCase() + c.status.slice(1)}
                </span>
              </div>
              <Goicon
                onClick={() => {
                  setViewDetails(c);
                  setSelectedCompany(true);
                }}
              />
            </div>
          ))
        )}
      </div>

      <Caution />

      {/* Add Admin Modal */}
      {isAddAdminOpen && (
        <div className="inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm fixed">
          <div className="relative w-[90%] max-w-md bg-gray-200 rounded-3xl shadow-xl p-5">
            {/* CLOSE BUTTON */}
            <div className="absolute top-4 right-4">
              <Crosicon
                onClick={() => {
                  setIsAddAdminOpen(false);
                  setIsEditMode(false);
                  setEditingAdmin(null);
                  resetAdminForm();
                }}
              />
            </div>

            <p className="flex font-bold text-(--color-primary) text-xl mb-5">
              {isEditMode ? "Edit Admin" : "Add Admin"}
            </p>

            {/* All Fields */}
            <form
              className="flex flex-col w-full h-full gap-8 md:gap-15 mb-5 px-2.5 py-5 max-h-[70vh] overflow-y-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col w-full gap-3 items-center justify-center">
                <InputBox
                  icon={<FaUser size={20} />}
                  type="text"
                  placeholder="Enter admin name"
                  value={form.name}
                  onChange={(value) => handleChange("name", value)}
                  required
                />
                <InputBox
                  icon={<TbMailFilled size={24} />}
                  type="email"
                  placeholder="Enter admin email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  required
                />
                {!isEditMode && (
                  <InputBox
                    icon={<MdLock size={26} />}
                    type="password"
                    placeholder="create password"
                    value={form.password}
                    onChange={(v) => handleChange("password", v)}
                    required
                  />
                )}

                {/* PLAN BUTTON */}
                <button
                  className="w-full bg-(--color-sidebar) text-(--color-gray) font-medium px-5 py-2.5 rounded-2xl shadow-lg flex justify-between items-center"
                  onClick={() => setPlanIsOpen(!planIsOpen)}
                >
                  <div className="flex gap-2.5 items-center justify-center">
                    <FaIndianRupeeSign size={20} />
                    {
                      planOptions.find((o) => o.value === planFilter)?.label
                    }{" "}
                    {"     "}
                    {planOptions.find((o) => o.value === planFilter)?.price}
                  </div>
                  <MdKeyboardArrowDown
                    size={30}
                    className={`transition-transform duration-200 ${
                      planIsOpen
                        ? "rotate-180 scale-130 text-(--color-primary)"
                        : ""
                    }`}
                  />
                </button>

                {/* PLAN OPTIONS */}
                {planIsOpen && (
                  <div className="relative w-full bg-[#faf6ff] md:bg-(--color-sidebar) rounded-2xl shadow-lg p-3 pb-1">
                    {planOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setPlanFilter(option.value);
                          if (option.value !== "trial") {
                            setPlanTypeFilter("monthly");
                          } else {
                            setPlanTypeFilter("");
                          }
                          setPlanIsOpen(false);
                        }}
                        className={`flex justify-between p-2 rounded-lg cursor-pointer mb-2 hover:bg-(--color-secondary)
                          ${
                            planFilter === option.value
                              ? "bg-(--color-secondary)"
                              : ""
                          }
                        `}
                      >
                        <p>{option.label}</p>
                        <p>{option.price}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PLAN TYPE BUTTON */}
                <button
                  disabled={planFilter === "trial"}
                  onClick={() => {
                    if (planFilter !== "trial") {
                      setPlanTypeIsOpen(!planTypeIsOpen);
                    }
                  }}
                  className={`w-full font-medium px-5 py-2.5 rounded-2xl shadow-lg flex justify-between items-center
                    ${
                      planFilter === "trial"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-(--color-sidebar) text-(--color-gray)"
                    }
                  `}
                >
                  <div className="flex gap-2.5 items-center justify-center">
                    <FaCalendarAlt size={20} />
                    {planFilter === "trial"
                      ? "Not applicable for Trial"
                      : planTypeOptions.find(
                          (o) => o.value === (planTypeFilter || "monthly")
                        )?.label}
                  </div>

                  {planFilter !== "trial" && (
                    <MdKeyboardArrowDown
                      size={30}
                      className={`transition-transform duration-200 ${
                        planTypeIsOpen
                          ? "rotate-180 scale-130 text-(--color-primary)"
                          : ""
                      }`}
                    />
                  )}
                </button>

                {/* PLAN TYPE OPTIONS */}
                {planTypeIsOpen && (
                  <div className="relative w-full bg-[#faf6ff] md:bg-(--color-sidebar) rounded-2xl shadow-lg p-3 pb-1">
                    {planTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setPlanTypeFilter(option.value); // ✅ correct
                          setPlanTypeIsOpen(false);
                        }}
                        className={`flex justify-between p-2 rounded-lg cursor-pointer mb-2 hover:bg-(--color-secondary)
                          ${
                            planTypeFilter === option.value
                              ? "bg-(--color-secondary)"
                              : ""
                          }
                        `}
                      >
                        <p>{option.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
            <Button
              title={
                loading
                  ? isEditMode
                    ? "Updating Admin..."
                    : "Adding Admin..."
                  : isEditMode
                  ? "Edit Admin"
                  : "Add Admin"
              }
              disabled={loading}
              onClick={handleSubmitClick}
            />
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedCompany && viewDetails && (
        <div className="inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 fixed">
          <div className="relative w-[90%] max-w-md bg-(--color-sidebar) rounded-3xl shadow-xl p-5">
            {/* MODAL CONTENT */}
            <div className="flex flex-col font-medium mb-5">
              <h2 className="text-xl font-bold text-(--color-primary) mb-4">
                Admin Details
              </h2>

              <div className="flex items-center- justify-between">
                <Image
                  src={viewDetails.imageUrl || "/default-profile.png"}
                  alt={viewDetails.name}
                  width={128}
                  height={128}
                  className="rounded-2xl object-cover h-32 w-32"
                />
                <p
                  className={`flex px-3 py-5 h-5 rounded-full font-semibold items-center justify-center
                    ${
                      viewDetails.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {viewDetails.status &&
                    viewDetails.status[0].toUpperCase() +
                      viewDetails.status.slice(1)}
                </p>
              </div>

              <div className="flex flex-col text-(--color-gray) text-lg mt-5 gap-3">
                <p className="font-bold text-xl text-black">
                  {viewDetails.name}
                </p>
                <p>
                  Mail : {"  "} {viewDetails.email}
                </p>
                <p>
                  Mobile : {"  "} {viewDetails.mobile}
                </p>
                <p>
                  Address : {"  "} {viewDetails.address}
                </p>
                <p>
                  Updated : {"  "} {viewDetails.updatedAt}
                </p>
                <p>
                  Plan : {"  "} {getPlanLabel(viewDetails.plan)} {"  "}
                  {getPlanPrice(viewDetails.plan)}
                </p>
                <p>
                  Plan Type : {"  "}{" "}
                  {getPlanTypeLabel(viewDetails.plan, viewDetails.planType)}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <Crosicon
                onClick={() => {
                  setSelectedCompany(false);
                  setViewDetails(null);
                }}
              />
            </div>
            <div className="class flex gap-4 justify-end">
              <div
                className="flex bg-gray-300 text-(--color-gray) hover:bg-(--color-secondary) hover:scale-110 hover:text-(--color-primary) p-2 rounded-full cursor-pointer transition-all shadow-lg"
                onClick={() => {
                  setIsEditMode(true);
                  setEditingAdmin(viewDetails);

                  setForm({
                    name: viewDetails.name,
                    email: viewDetails.email,
                    password: "",
                  });

                  setPlanFilter(viewDetails.plan || "trial");

                  setPlanTypeFilter(
                    viewDetails.plan === "trial"
                      ? ""
                      : viewDetails.planType || "monthly"
                  );

                  setIsAddAdminOpen(true);
                  setSelectedCompany(false);
                }}
              >
                <MdEdit size={26} />
              </div>

              <div
                className="flex bg-gray-300 text-(--color-gray) hover:bg-(--color-secondary) hover:scale-110 hover:text-(--color-primary) p-2 rounded-full cursor-pointer transition-all shadow-lg"
                onClick={() => setIsDeleteOpen(true)}
              >
                <MdDelete size={26} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className=" w-[90%] max-w-md bg-gray-200 rounded-3xl shadow-lg p-5 fixed">
            {/* TITLE */}
            <p className="text-xl font-bold text-red-400 mb-4">Delete Admin</p>

            <p className="text-gray-600 mb-4">
              Please type{" "}
              <span className="font-bold text-black">{viewDetails.name}</span>{" "}
              to confirm deletion.
            </p>

            {/* INPUT */}
            <div key={shakeKey}>
              <InputBox
                icon={
                  <p
                    key={shakeKey} // 🔥 forces re-mount
                    className={`flex justify-center items-center ${
                      deleteError ? "delete-shake" : ""
                    }`}
                  >
                    {/* <FaRegSmile
                      size={20}
                      className={`${
                        deleteError ? "text-red-400" : "text-(--color-gray)"
                      } transition-colors duration-200`}
                    /> */}
                    <span
                      className={` text-xl ${
                        deleteError ? "text-red-400" : "text-(--color-gray)"
                      } transition-colors duration-200`}
                    >
                      {deleteError ? "😡" : "😎"}
                    </span>
                  </p>
                }
                placeholder="Enter admin name"
                value={confirmName}
                onChange={(value) => {
                  setConfirmName(value);
                  if (deleteError) setDeleteError("");
                }}
                className={`${
                  deleteError ? "text-red-400" : "text-(--color-gray)"
                }`}
              />
            </div>

            {/* ERROR */}
            {deleteError && (
              <div className="flex items-center text-red-400 mx-4.5 my-2 gap-3">
                <FaExclamationTriangle size={20} />
                <p>{deleteError}</p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                title="Cancel"
                className="bg-gray-300 text-gray-600 hover:bg-gray-400 "
                onClick={() => setIsDeleteOpen(false)}
              />

              <Button
                title="Delete"
                className="bg-red-200 text-red-400 hover:bg-red-300 hover:text-(--color-sidebar)"
                onClick={handleDeleteAdminClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
