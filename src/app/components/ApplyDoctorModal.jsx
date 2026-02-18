// src/components/dashboard/ApplyDoctorModal.jsx
"use client";

import { useState } from "react";
// import { CheckIcon, IoWarning } from "@/components/icons"; // adjust import
import { FaUserDoctor } from "react-icons/fa6";
import { CircleAlert, CircleCheck, X } from "lucide-react";

export default function ApplyDoctorModal({ isOpen, onClose, session }) {
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    cvUrl: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/apply-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, appliedDoctor: true }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Application failed.");
      }

      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaUserDoctor className="w-6 h-6 text-blue-700" />
              Doctor's Joining Form
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center mb-6 gap-2">
            <CircleAlert className="w-5 h-5 text-amber-500" />
            <p className="text-[#212121] text-sm">
              Your profile will be reviewed against our doctors' list for
              approval.
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-5">
            {/* form fields same as before */}
            {/* ... copy your existing form fields here ... */}

            {error && (
              <div className="alert alert-error text-sm mt-4">{error}</div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline text-[#212121]"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Applying...
                  </>
                ) : (
                  <>
                    <CircleCheck className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
