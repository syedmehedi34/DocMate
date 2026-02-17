// // src/app/api/apply-doctor/route.js

// import dbConnect from "../../../../lib/mongodb";
// import User from "../../../../models/User";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req) {
//   await dbConnect();

//   // Retrieve the session from the server
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const {
//     name,
//     cvUrl,
//     imageUrl,
//     category,
//     chamberDays,
//     chamberOpeningTime,
//     chamberClosingTime,
//   } = await req.json();

//   if (!cvUrl || !imageUrl || !category) {
//     return NextResponse.json(
//       { message: "Missing required fields" },
//       { status: 400 },
//     );
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       session.user.id,
//       {
//         name: name,
//         doctorCvUrl: cvUrl,
//         doctorImageUrl: imageUrl,
//         doctorCategory: category,
//         appliedDoctor: true,
//       },
//       { new: true },
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Application submitted", user: updatedUser },
//       { status: 200 },
//     );
//   } catch (error) {
//     // console.error("Error applying to be a doctor:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
// src/app/api/apply-doctor/route.js

import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb"; // তোমার path অনুযায়ী adjust করো
import User from "../../../../models/User";
import { auth } from "@/auth"; // ← এখান থেকে import করো (auth.js যেখানে আছে)

export async function POST(req) {
  try {
    await dbConnect();

    // session পাওয়ার সঠিক v5 উপায়
    const session = await auth();

    // চেক করো user logged in আছে কি না
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
          doctorApplicationStatus: "pending", // optional — tracking-এর জন্য ভালো
          doctorAppliedAt: new Date(),
        },
      },
      {
        new: true, // updated document return করবে
        runValidators: true, // schema validation চালাবে
      },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // সফল রেসপন্স
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
