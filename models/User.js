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
  abouts: {
    type: String,
    default: "",
  },
  degrees: {
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
  consultationFee: {
    type: Number,
    default: 0,
  },
  experienceYear: {
    type: Number,
    default: 0,
  },
  worksAndExperiences: {
    type: [String],
    default: [],
  },
  specializations: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
