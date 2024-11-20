import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  const { username, roomId } = await req.json();

  //   if (!username || !roomId) {
  //     return NextResponse.json(
  //       { error: "Username and Room ID are required" },
  //       { status: 400 }
  //     );
  //   }

  try {
    const client = await clientPromise;
    const db = client.db();
    const chatroomsCollection = db.collection("chatrooms");

    await chatroomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $addToSet: { users: username }, $inc: { userCount: 1 } }
    );

    return NextResponse.json({ message: "Joined chatroom successfully" });
  } catch (error) {
    console.error("Error joining chatroom:", error);
    return NextResponse.json(
      { error: "Failed to join chatroom" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch chatrooms from the database
    const chatrooms = await db
      .collection("chatrooms")
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json(chatrooms);
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatrooms" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { username, roomId } = await req.json();

  if (!username || !roomId) {
    return NextResponse.json(
      { error: "Username and Room ID are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const chatroomsCollection = db.collection("chatrooms");

    await chatroomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $pull: { users: username }, $inc: { userCount: -1 } }
    );

    return NextResponse.json({ message: "Left chatroom successfully" });
  } catch (error) {
    console.error("Error leaving chatroom:", error);
    return NextResponse.json(
      { error: "Failed to leave chatroom" },
      { status: 500 }
    );
  }
}
