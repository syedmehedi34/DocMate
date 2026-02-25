import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

// get user by ID (GET request)
export async function GET(req, { params }) {
  await dbConnect();

  try {
    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// Update user by ID (PUT request) - [admin - All Users, ]
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { name, email, role, isPatient } = await req.json();

    if (!params || !params.id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id, // Ensure params.id is correctly accessed
      { name, email, role, isPatient },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE user by ID (DELETE request) - [admin - All Users, ]
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}

// update user profile data (patch request) - [user - Profile, ]
export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const updates = await req.json();

    if (!params || !params.id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // openAppointmentsDates- cleanup for multiple same date
    if (
      updates.openAppointmentsDates &&
      Array.isArray(updates.openAppointmentsDates)
    ) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Step 1: string → Date, invalid skip, past skip
      let cleanedDates = updates.openAppointmentsDates
        .map((date) => new Date(date))
        .filter(
          (date) =>
            date instanceof Date && !isNaN(date.getTime()) && date >= today,
        );

      // Step 2: duplicate dates remove (same day)
      const uniqueDatesMap = new Map();

      cleanedDates.forEach((date) => {
        const dateKey = date.toISOString().split("T")[0]; // "2025-03-15"
        if (!uniqueDatesMap.has(dateKey)) {
          uniqueDatesMap.set(dateKey, date);
        }
      });

      updates.openAppointmentsDates = Array.from(uniqueDatesMap.values())
        .sort((a, b) => a - b) // chronological order
        .map((date) => date.toISOString());
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }
}
