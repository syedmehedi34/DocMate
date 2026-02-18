"use client";

import { useState } from "react";
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
        throw new Error(
          errData.message || "Application failed. Please try again.",
        );
      }

      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaUserDoctor className="w-6 h-6 text-blue-700" />
              Doctor's Joining Form
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Warning */}
          <div className="flex items-center mb-6 gap-2 bg-amber-50 p-3 rounded-lg">
            <CircleAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Your profile will be reviewed against our doctors' list for
              approval.
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input input-bordered w-full text-black bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV URL (Google Drive / Dropbox / etc.)
              </label>
              <input
                type="url"
                name="cvUrl"
                value={formData.cvUrl}
                onChange={handleChange}
                className="input input-bordered w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input input-bordered w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty / Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your specialty</option>
                <option value="general">General Practitioner</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="gynecology">Gynecology</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-error shadow-lg text-sm">
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline text-gray-700 hover:bg-gray-100"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary min-w-[140px] flex items-center gap-2"
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
