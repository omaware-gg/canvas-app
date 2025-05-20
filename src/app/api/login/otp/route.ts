import { NextApiRequest } from "next";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/db";
import { handleServerError } from "@/app/services/utils";
import { sendOtp } from "@/app/services/server/utils";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
  
    if (!email) {
      return NextResponse.json({
        success: false,
        error: "Email is required",
        toast: {
          type: "error",
          message: "Email is required",
        },
      }, { status: 400 });
    }
  
    const otp = randomInt(100000, 999999).toString();
  
    const otpSent = await sendOtp(email, otp);

    let otpObject = await prisma.otp.findUnique({
      where: {
        email,
      },
    })
    
    if (otpObject) {
      otpObject = await prisma.otp.update({
        where: {
          email,
        },
        data: {
          otp,
          validTill: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    } else {
      otpObject = await prisma.otp.create({
        data: {
          email,
          otp,
          validTill: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      toast: {
        type: "success",
        message: "OTP sent successfully",
      }
    }, { status: 200 })
  } catch (error: any) {
    return handleServerError(error);
  }
}