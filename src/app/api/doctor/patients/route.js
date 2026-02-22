import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Appointment from "../../../../../models/Appointment";
import User from "../../../../../models/User";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // doctor access only
    if (session.user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can view their patients" },
        { status: 403 },
      );
    }

    const doctorId = session.user.id;

    // Step 1: find confirmed/completed appointment
    const appointments = await Appointment.find({
      doctorId: doctorId,
      $or: [{ status: "confirmed" }, { status: "completed" }],
    })
      .select(
        "applicantUserId userId applicantName applicantEmail patientName patientAge patientGender patientPhone appointmentDate diseaseDetails adminNotes doctorNotes",
      )
      .sort({ appointmentDate: -1 }) // sort by latest appointment first
      .lean();

    if (appointments.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 2: find unique patient IDs
    const patientIds = new Set();
    appointments.forEach((appt) => {
      const pid = appt.applicantUserId || appt.userId;
      if (pid) patientIds.add(pid.toString());
    });

    if (patientIds.size === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 3: collect patient details from User collection
    const patients = await User.find({
      _id: { $in: Array.from(patientIds) },
    })
      .select("name email phone age gender profilePicture")
      .lean();

    // Step 4: enrich patient data with their latest appointment info and all appointment dates
    const enrichedPatients = patients.map((patient) => {
      const patientAppointments = appointments.filter(
        (appt) =>
          (appt.applicantUserId || appt.userId)?.toString() ===
          patient._id.toString(),
      );

      // all appointment dates in a single array
      const allAppointmentDates = patientAppointments
        .map((a) => a.appointmentDate)
        .filter(Boolean);

      // latest appointment date
      const latestAppt = patientAppointments[0];

      return {
        _id: patient._id.toString(),
        applicantUserId: latestAppt?.applicantUserId?.toString() || null,
        applicantName: latestAppt?.applicantName || patient.name || "—",
        applicantEmail: latestAppt?.applicantEmail || patient.email || "—",
        patientName: latestAppt?.patientName || patient.name || "—",
        patientAge: latestAppt?.patientAge || patient.age || null,
        patientGender: latestAppt?.patientGender || patient.gender || "—",
        patientPhone: latestAppt?.patientPhone || patient.phone || "N/A",
        appointmentDate: allAppointmentDates, // array of all dates
        lastAppointmentDate: latestAppt?.appointmentDate || "—",
        diseaseDetails: latestAppt?.diseaseDetails || "—",
        adminNotes: latestAppt?.adminNotes || "—",
        doctorNotes: latestAppt?.doctorNotes || "—",
        appointmentCount: patientAppointments.length,
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
