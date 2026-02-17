// // /app/api/profile/update/route.js

// import { NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/mongodb";
// import User from "../../../../../models/User";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";

// export async function PUT(req) {
//     await dbConnect();
//     const session = await getServerSession(authOptions);
//     const userId = session?.user?.id;

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     try {
//       const { name, image } = await req.json();
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { name, image },
//         { new: true }
//       );

//       return NextResponse.json({ user: updatedUser }, { status: 200 });
//     } catch (error) {
//       console.error("Profile update error:", error);
//       return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
//   }
// src/app/api/profile/update/route.js   (অথবা app/api/profile/update/route.js)

import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb"; // path adjust করো যদি src/ এ থাকে
import User from "../../../../../models/User";
import { auth } from "@/auth"; // ← এখান থেকে import (auth.js যেখানে আছে)

export async function PUT(req) {
  try {
    await dbConnect();

    // v5-এ session পাওয়ার সঠিক উপায়
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please login first" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const body = await req.json();
    const { name, image } = body; // image মানে profile picture URL হবে ধরে নিচ্ছি

    // Optional: validation যোগ করতে পারো
    if (!name && !image) {
      return NextResponse.json(
        { message: "No fields provided to update" },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name?.trim() || undefined,
          image: image || undefined, // profile picture URL
          updatedAt: new Date(),
        },
      },
      {
        new: true, // updated document return করবে
        runValidators: true, // schema validation চালাবে (যদি Mongoose schema থাকে)
      },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // সফল রেসপন্স — frontend-এ নতুন ডেটা পাঠাও
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          image: updatedUser.image,
          email: updatedUser.email, // optional
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
