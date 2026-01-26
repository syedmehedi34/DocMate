import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },
  isPatient: {
    type: Boolean,
    default: false,
  },
  doctorCvUrl: {
    type: String,
    default: "",
  },
  doctorImageUrl: {
    type: String,
    default: "",
  },
  doctorCategory: {
    type: String,
    default: "-",
    enum: [
      "-",
      "general",
      "cardiology",
      "dermatology",
      "neurology",
      "pediatrics",
      "other",
    ],
  },
  appliedDoctor: {
    type: Boolean,
    default: false,
  },
  chamberDays: {
    type: [String],
    default: [],
    required: false,
  },
  chamberTime: {
    type: [String],
    default: [],
    required: false,
  },
  about: {
    type: String,
    default: "",
  },
  degree: {
    type: [String],
    default: [],
  },
  appointmentNumber: {
    type: String,
    default: "",
  },
  appointmentEmail: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  doctorNumber: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "Not Mentioned"],
    default: "Not Mentioned",
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  experienceYear: {
    type: Number,
    default: 0,
  },
  worksAndExperiences: {
    type: [
      {
        workedAt: String,
        position: String,
        duration: String,
      },
    ],
    default: [],
  },

  specializations: {
    type: [String],
    default: [],
  },
  joinedHospitals: {
    type: [String],
    default: [],
  },
  currentStatus: {
    type: String,
    enum: ["available", "on-leave"],
    default: "available",
  },
  educations: {
    type: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    default: [],
  },
  socialMediaLinks: {
    type: [
      {
        platform: String,
        url: String,
      },
    ],
    default: [],
  },
  openAppointmentsDates: {
    type: [Date],
    default: [],
  },
  reviews: {
    type: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        reviewMessage: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  maxPatientCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
