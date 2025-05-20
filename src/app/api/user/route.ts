import { authenticateUser } from "@/app/services/server/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  
  return NextResponse.json({ success: true, data: { user } });
}