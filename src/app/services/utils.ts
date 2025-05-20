import { NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function ifetch(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (data.toast) {
    const toastType = data.toast.type as "error" | "success" | "info" | "warning" | "default";
    if (toastType == "default") toast(data.toast.message);
    else toast[toastType](data.toast.message);
  }
  return data;
}

export interface UserObject {
  id: string;
  email: string;
  name?: string | null;
  canvases: any[];
  createdAt: Date;
  updatedAt: Date;
};

export class CanvasError extends Error {
  statusCode: number;

  constructor(name: string, statusCode: number, message: string,) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export function handleServerError(error: any) {
  console.error(error);

  if (error instanceof CanvasError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      toast: {
        type: "error",
        message: error.message,
      },
    }, { status: error.statusCode });
  }
  
  return NextResponse.json({
    success: false,
    error: error.message,
    toast: {
      type: "error",
      message: "Some Error Occurred",
    },
  }, { status: 500 });
}

export async function validateToken(token: string) {
  if (!token) {
    return false;
  }
  const response = await ifetch("/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (response && response.success) {
    return response.data.user;
  }
  else {
    return false;
  }
}