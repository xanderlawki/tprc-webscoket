import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch messages for the room
    const messages = await db
      .collection("messages")
      .find({ roomId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;
  const { content, sender } = await req.json();

  if (!roomId || !content || !sender) {
    return NextResponse.json(
      { error: "Room ID, content, and sender are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Save the message to the database
    const newMessage = {
      roomId,
      content,
      sender,
      timestamp: new Date(),
    };

    await db.collection("messages").insertOne(newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
