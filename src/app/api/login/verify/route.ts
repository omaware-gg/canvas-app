import { prisma } from "@/app/services/db";
import { handleServerError } from "@/app/services/utils";
import { NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        error: "Email and OTP are required",
        toast: {
          type: "error",
          message: "Email and OTP are required",
        },
      }, { status: 400 });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
      },
    });

    if (!otpRecord) {
      return NextResponse.json({
        success: false,
        error: "Invalid or expired OTP",
        toast: {
          type: "error",
          message: "Invalid or expired OTP",
        },
      }, { status: 404 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({
        success: false,
        error: "Invalid OTP",
        toast: {
          type: "error",
          message: "Invalid OTP",
        },
      }, { status: 400 });
    }

    if (otpRecord.validTill < new Date()) {
      return NextResponse.json({
        success: false,
        error: "OTP has expired",
        toast: {
          type: "error",
          message: "OTP has expired",
        },
      }, { status: 400 });
    }

    // Delete OTP record
    await prisma.otp.delete({
      where: {
        email,
      },
    });

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
        select: {
          id: true,
          email: true,
          name: true,
        }
      })
    }

    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
    }).setExpirationTime("30d").setProtectedHeader({ alg: "HS256" }).sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        user,
        token,
      },
      toast: {
        type: "success",
        message: "OTP verified successfully",
      },
    }, { status: 200 });
  } catch (error: any) {
    return handleServerError(error);
  }
}