import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Appointment from "../../../../models/Appointment";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId parameter is required" },
        { status: 400 },
      );
    }

    const pendingAppointments = await Appointment.find({
      doctorId: doctorId,
      isAppointmentConfirmed: false,
      status: "pending",
    })
      .sort({ appliedAt: -1 })
      .lean();

    const appointmentsWithPatientInfo = await Promise.all(
      pendingAppointments.map(async (appointment) => {
        const patient = await User.findById(
          appointment.applicantUserId || appointment.userId,
        )
          // .select("name email phone")
          .lean();

        return {
          ...appointment,
        };
      }),
    );

    return NextResponse.json(appointmentsWithPatientInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
