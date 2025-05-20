import { prisma } from "@/app/services/db";
import { authenticateUser } from "@/app/services/server/utils";
import { handleServerError, UserObject } from "@/app/services/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const name = (await req.json()).name;
    if (!name) return NextResponse.json({ success: false, error: "Name is missing" }, { status: 400 });

    const updatedUser = await prisma.user.update({
      where: { id: (user as UserObject).id },
      data: { name },
      include: { canvases: true }
    });

    return NextResponse.json({
      success: true,
      data: { user: updatedUser },
      toast: {
        type: "success",
        message: "Name updated successfully"
      }
    });
  } catch (e: any) {
    console.log("error toh aa raha hai");
    return handleServerError(e);
  }
}