import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const sessionId = uuidv4();
  return NextResponse.json({ sessionId });
}