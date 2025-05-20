import { PrismaClient } from "@prisma/client";
import validator from "validator";
import { CanvasError } from "../utils";

export const prisma = new PrismaClient();
prisma.$use(async (params, next) => {
  if ((params.model === 'User' || params.model === 'Otp') && (params.action === 'create' || params.action === 'update')) {
    const email = params.args.data.email;

    if (email && !validator.isEmail(email)) {
      throw new CanvasError('InvalidEmail', 400, 'Invalid email');
    }
  }

  return next(params);
});
