import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import Appointment from "../../../../../models/Appointment";
import User from "../../../../../models/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // access only for doctors
    if (session.user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can view their patients" },
        { status: 403 },
      );
    }

    // doctorId taken from session
    const doctorId = session.user.id;

    // Step 1: doctor-এর confirmed/completed appointments নেওয়া
    const appointments = await Appointment.find({
      doctorId: doctorId,
      $or: [
        { status: "confirmed" },
        { status: "completed" }, //
      ],
    })
      .select(
        "applicantUserId userId patientName patientPhone diseaseDetails reason appointmentDate",
      )
      .sort({ appointmentDate: -1 }) // newest first
      .lean();

    if (appointments.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 2: Unique patient IDs
    const patientIds = new Set();

    appointments.forEach((appt) => {
      const pid = appt.applicantUserId || appt.userId;
      if (pid) {
        patientIds.add(pid.toString());
      }
    });

    if (patientIds.size === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 3: Unique patients-এর details নেওয়া
    const patients = await User.find({
      _id: { $in: Array.from(patientIds) },
    })
      .select("name email phone age gender profilePicture")
      .lean();

    // Step 4: প্রত্যেক patient-এর সাথে latest appointment info যোগ করা
    const enrichedPatients = patients.map((patient) => {
      const patientAppts = appointments.filter(
        (appt) =>
          (appt.applicantUserId || appt.userId)?.toString() ===
          patient._id.toString(),
      );

      // সবচেয়ে নতুন appointment
      const latestAppt = patientAppts[0]; // যেহেতু sort(-1) করা আছে

      return {
        ...patient,
        phone: latestAppt?.patientPhone || patient.phone || "N/A",
        patientName: latestAppt?.patientName || patient.name || "—",
        reason: latestAppt?.diseaseDetails || latestAppt?.reason || "—",
        lastAppointmentDate: latestAppt?.appointmentDate || "—",
        appointmentCount: patientAppts.length,
      };
    });

    return NextResponse.json(enrichedPatients);
  } catch (error) {
    console.error("GET /api/doctor/patients error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
