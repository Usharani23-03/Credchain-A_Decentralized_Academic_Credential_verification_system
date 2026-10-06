"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  User,
  Mail,
  Shield,
  Lock,
  Bell,
  Moon,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "@/services/api";

interface UserType {
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * Load user + saved preferences
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to read stored user:", error);
      }
    }

    const savedNotifications =
      localStorage.getItem("emailNotifications");

    const savedDarkMode =
      localStorage.getItem("darkMode");

    if (savedNotifications !== null) {
      setEmailNotifications(savedNotifications === "true");
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    } else {
      setDarkMode(true);
    }
  }, []);

  /*
   * Apply dark mode
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.remove("bg-white");
      document.body.classList.add("bg-slate-950");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-slate-950");
      document.body.classList.add("bg-white");
    }
  }, [darkMode]);

  /*
   * Save preferences
   */
  const handleSaveChanges = () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      localStorage.setItem(
        "emailNotifications",
        String(emailNotifications)
      );

      localStorage.setItem(
        "darkMode",
        String(darkMode)
      );

      setSuccessMessage("Preferences saved successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * Open password modal
   */
  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setSuccessMessage("");
    setErrorMessage("");

    setShowPasswordModal(true);
  };

  /*
   * Close password modal
   */
  const closePasswordModal = () => {
    if (changingPassword) return;

    setShowPasswordModal(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setErrorMessage("");
  };

  /*
   * Change password
   */
  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccessMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("CHANGE PASSWORD ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">

        {/* Page Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Account Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account preferences and security.
          </p>
        </div>

        {/* Success Message */}

        {successMessage && !showPasswordModal && (
          <div className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-4">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}

        {errorMessage && !showPasswordModal && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ========================= */}
          {/* PERSONAL INFORMATION */}
          {/* ========================= */}

          <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Personal Information
            </h2>

            <div className="space-y-6">

              {/* Name */}

              <div>
                <label className="text-slate-400">
                  Full Name
                </label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <User
                    className="text-cyan-400 mr-3"
                    size={20}
                  />

                  <input
                    value={user?.name || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="text-slate-400">
                  Email
                </label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <Mail
                    className="text-cyan-400 mr-3"
                    size={20}
                  />

                  <input
                    value={user?.email || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

              {/* Role */}

              <div>
                <label className="text-slate-400">
                  Role
                </label>

                <div className="flex items-center mt-2 bg-slate-900 rounded-xl px-4 py-4">
                  <Shield
                    className="text-cyan-400 mr-3"
                    size={20}
                  />

                  <input
                    value={user?.role || ""}
                    readOnly
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ========================= */}
          {/* PREFERENCES */}
          {/* ========================= */}

          <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-8">
              Preferences
            </h2>

            <div className="space-y-6">

              {/* EMAIL NOTIFICATIONS */}

              <div className="flex justify-between items-center bg-slate-900 p-5 rounded-xl">

                <div className="flex items-center gap-4">

                  <Bell
                    className="text-cyan-400"
                    size={22}
                  />

                  <div>
                    <span className="text-white block">
                      Email Notifications
                    </span>

                    <span className="text-slate-500 text-sm">
                      Receive important account notifications
                    </span>
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) =>
                    setEmailNotifications(e.target.checked)
                  }
                  className="h-5 w-5 cursor-pointer accent-cyan-500"
                />

              </div>

              {/* DARK MODE */}

              <div className="flex justify-between items-center bg-slate-900 p-5 rounded-xl">

                <div className="flex items-center gap-4">

                  <Moon
                    className="text-cyan-400"
                    size={22}
                  />

                  <div>
                    <span className="text-white block">
                      Dark Mode
                    </span>

                    <span className="text-slate-500 text-sm">
                      Use dark theme throughout the application
                    </span>
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) =>
                    setDarkMode(e.target.checked)
                  }
                  className="h-5 w-5 cursor-pointer accent-cyan-500"
                />

              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={saving}
                className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition rounded-xl py-4 font-semibold text-white flex justify-center items-center gap-3"
              >

                <Save size={20} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

              {/* CHANGE PASSWORD */}

              <button
                type="button"
                onClick={openPasswordModal}
                className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl py-4 font-semibold text-white flex justify-center items-center gap-3"
              >

                <Lock size={20} />

                Change Password

              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ================================= */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl p-8 shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Change Password
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Update your account password
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={changingPassword}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>

            </div>

            {/* Modal Error */}

            {errorMessage && (
              <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3">
                <AlertCircle size={18} />
                <span className="text-sm">
                  {errorMessage}
                </span>
              </div>
            )}

            {/* Modal Success */}

            {successMessage && (
              <div className="mb-5 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3">
                <CheckCircle size={18} />
                <span className="text-sm">
                  {successMessage}
                </span>
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >

              {/* Current Password */}

              <div>

                <label className="text-slate-300 text-sm">
                  Current Password
                </label>

                <div className="relative mt-2">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Enter current password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>
              </div>

              {/* New Password */}

              <div>

                <label className="text-slate-300 text-sm">
                  New Password
                </label>

                <div className="relative mt-2">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

                <p className="text-slate-500 text-xs mt-2">
                  Minimum 6 characters
                </p>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="text-slate-300 text-sm">
                  Confirm New Password
                </label>

                <div className="relative mt-2">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* Buttons */}

              <div className="flex gap-4 pt-3">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
                >
                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}