import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Appointment from "../../../../models/Appointment";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const {
      doctorId,
      doctorName,
      doctorEmail,
      applicantUserId,
      applicantUserName,
      applicantUserEmail,
      patientName,
      patientAge,
      patientGender,
      patientEmail,
      patientPhone,
      appointmentDate,
      diseaseDetails,
      consultationFee,
      currency,
      cashOnAppointmentDay,
      appliedAt,
      isAppointmentConfirmed = false,
    } = body;

    // checking required fields
    if (
      !doctorId ||
      !doctorName ||
      !doctorEmail ||
      !applicantUserId ||
      !applicantUserName ||
      !applicantUserEmail ||
      !patientName ||
      !patientPhone ||
      !appointmentDate ||
      !consultationFee ||
      cashOnAppointmentDay === undefined
    ) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 },
      );
    }

    // Optional: duplicate চেক (যদি একই দিনে একই পেশেন্ট একই ডাক্তারের সাথে বুক করতে না পারে)
    const existing = await Appointment.findOne({
      doctorId,
      patientPhone,
      appointmentDate,
      // status: { $ne: "cancelled" }   // ← cancelled হলে আবার বুক করতে দিতে চাইলে এটা বাদ দাও
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            "An appointment already exists for this patient with the same doctor on the selected date.",
        },
        { status: 409 },
      );
    }

    // নতুন অ্যাপয়েন্টমেন্ট তৈরি
    const newAppointment = new Appointment({
      doctorId,
      doctorName,
      doctorEmail,
      applicantUserId,
      applicantName: applicantUserName, // স্কিমায় applicantName
      applicantEmail: applicantUserEmail,
      patientName,
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientGender,
      patientEmail,
      patientPhone,
      appointmentDate,
      diseaseDetails,
      consultationFee: Number(consultationFee),
      currency: currency || "BDT",
      cashOnAppointmentDay: Boolean(cashOnAppointmentDay),
      appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
      isAppointmentConfirmed: Boolean(isAppointmentConfirmed),
      status: isAppointmentConfirmed ? "confirmed" : "pending",
    });

    console.log("Saving appointment:", newAppointment.toObject());

    await newAppointment.save();

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointmentId: newAppointment._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { message: "Failed to book appointment", error: error.message },
      { status: 500 },
    );
  }
}
