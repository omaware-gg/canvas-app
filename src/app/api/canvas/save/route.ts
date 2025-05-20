import { prisma } from "@/app/services/db";
import { authenticateUser } from "@/app/services/server/utils";
import { handleServerError, UserObject } from "@/app/services/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req) as UserObject;
    const { name, dataUrl } = await req.json();
    if (!name || !dataUrl) {
      return NextResponse.json({
        success: false,
        error: "Name or data is missing",
        toast: {
          type: "error",
          message: "Some error occurred"
        }
      }, { status: 400 })
    }
  
    await prisma.canvas.create({
      data: {
        name,
        dataUrl,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })
  
    const updatedUesr = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        canvases: true
      }
    })
  
    return NextResponse.json({
      success: true,
      data: {
        user: updatedUesr
      },
      toast: {
        type: "success",
        message: "Canvas saved successfully"
      }
    }, { status: 201 })
  } catch (e: any) {
    return handleServerError(e);
  }
}