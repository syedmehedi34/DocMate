import { NextResponse } from "next/server";
import { auth } from "@/auth";
// import dbConnect from "@/lib/mongodb";
import Appointment from "../../../../../models/Appointment";
import dbConnect from "../../../../../lib/mongodb";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

function notFound() {
  return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user) {
      return unauthorized();
    }

    const { id } = await params;
    const body = await request.json();

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return notFound();
    }

    const userId = session?.user.id;
    const userRole = session?.user.role;

    let updatedFields = {};

    // doctor updates only
    if (userRole === "doctor") {
      if (appointment.doctorId.toString() !== userId) {
        return forbidden("This is not your appointment");
      }

      if ("status" in body) {
        const newStatus = body.status;

        if (newStatus === "confirmed") {
          updatedFields.status = "confirmed";
          updatedFields.isAppointmentConfirmed = true;
        } else if (newStatus === "rejected") {
          updatedFields.status = "rejected";
          updatedFields.isAppointmentConfirmed = false;
        } else if (newStatus === "cancelled") {
          updatedFields.status = "cancelled";
          updatedFields.cancelledBy = "doctor";
        } else {
          return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 },
          );
        }
      }

      if (body.doctorNotes !== undefined) {
        updatedFields.doctorNotes = body.doctorNotes;
      }
    }
    // user update only
    else if (userRole === "user") {
      const patientId = appointment.applicantUserId || appointment.userId;

      if (patientId?.toString() !== userId) {
        return forbidden("This is not your appointment");
      }

      // only user can cancel their appointment
      if (body.status === "cancelled") {
        if (appointment.status !== "pending") {
          return forbidden(
            "You can only cancel pending and unconfirmed appointments",
          );
        }

        updatedFields.status = "cancelled";
      } else {
        return forbidden("Users/patients can only cancel appointments");
      }
    }
    //
    else if (userRole === "admin") {
      updatedFields = { ...body };
    } else {
      return forbidden("Invalid role");
    }

    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json(
        { error: "No updates provided" },
        { status: 400 },
      );
    }

    Object.assign(appointment, updatedFields);
    appointment.updatedAt = new Date();

    await appointment.save();

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
