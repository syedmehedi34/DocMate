import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please login first" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      name,
      cvUrl,
      imageUrl,
      category,
      chamberDays,
      chamberOpeningTime,
      chamberClosingTime,
    } = body;

    // Required fields validation
    if (!cvUrl || !imageUrl || !category) {
      return NextResponse.json(
        { message: "Missing required fields: cvUrl, imageUrl, category" },
        { status: 400 },
      );
    }

    // User update (doctor apply logic)
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name: name?.trim() || undefined,
          doctorCvUrl: cvUrl,
          doctorImageUrl: imageUrl,
          doctorCategory: category,
          doctorChamberDays: chamberDays || undefined,
          doctorChamberOpeningTime: chamberOpeningTime || undefined,
          doctorChamberClosingTime: chamberClosingTime || undefined,
          appliedDoctor: true,
          doctorApplicationStatus: "pending",
          doctorAppliedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    //
    return NextResponse.json(
      {
        message: "Doctor application submitted successfully",
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          appliedDoctor: updatedUser.appliedDoctor,
          doctorApplicationStatus:
            updatedUser.doctorApplicationStatus || "pending",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Apply doctor error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
