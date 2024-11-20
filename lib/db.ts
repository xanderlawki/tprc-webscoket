import clientPromise from "./mongodb";

export async function getDatabase() {
  const client = await clientPromise;
  return client.db();
}

export async function seedChatrooms() {
  const db = await getDatabase();
  const chatrooms = [
    { name: "General", createdAt: new Date(), userCount: 0 },
    { name: "Technology", createdAt: new Date(), userCount: 0 },
    { name: "Gaming", createdAt: new Date(), userCount: 0 },
    { name: "Music", createdAt: new Date(), userCount: 0 },
    { name: "Random", createdAt: new Date(), userCount: 0 },
  ];
  await db.collection("chatrooms").insertMany(chatrooms);
}
