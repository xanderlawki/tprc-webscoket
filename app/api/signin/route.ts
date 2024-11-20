import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    // Validate input
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (!existingUser) {
      // Create a new user if they don't already exist
      await usersCollection.insertOne({ username, createdAt: new Date() });
    }

    return NextResponse.json({ message: "Signin successful", username });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
