import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Seed chatrooms
    const chatrooms = [
      { name: "General", createdAt: new Date(), userCount: 0 },
      { name: "Technology", createdAt: new Date(), userCount: 0 },
      { name: "Gaming", createdAt: new Date(), userCount: 0 },
      { name: "Music", createdAt: new Date(), userCount: 0 },
      { name: "Random", createdAt: new Date(), userCount: 0 },
    ];

    const chatroomsCollection = db.collection("chatrooms");
    await chatroomsCollection.insertMany(chatrooms);

    return NextResponse.json({ message: "Chatrooms seeded successfully!" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
