import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Doctor Info
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Applicant / Booker Info (the logged-in user who submitted the form)
    applicantUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Patient Info (can be different person if someone books for family/friend)
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    patientGender: {
      type: String,
      enum: ["Male", "Female", null],
      required: true,
    },
    patientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: false,
    },
    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // Appointment Details
    appointmentDate: {
      type: String, // e.g. "15 Oct 2025"
      required: true,
    },

    diseaseDetails: {
      type: String,
      trim: true,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "$",
    },
    cashOnAppointmentDay: {
      type: Boolean,
      required: true,
      default: true,
    },

    // Status & Timestamps
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    isAppointmentConfirmed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // Optional: notes from doctor/admin
    adminNotes: {
      type: String,
      trim: true,
      default: "",
      required: false,
    },
    doctorNotes: {
      type: String,
      trim: true,
      default: "",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ applicantUserId: 1, appliedAt: -1 });
appointmentSchema.index({ status: 1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
