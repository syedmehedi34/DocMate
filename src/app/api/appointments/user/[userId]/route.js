// api/appointments/user/[userId]/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb";
import Appointment from "../../../../../../models/Appointment";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { userId } = params; // no need for await here

    const appointments = await Appointment.find({
      applicantUserId: userId,
    }).sort({
      createdAt: -1,
    });

    // Always return 200 + array (empty is fine)
    return NextResponse.json(appointments || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
