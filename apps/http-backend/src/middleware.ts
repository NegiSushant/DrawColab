import { JWT_SECRET } from "@repo/backend-config/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get the token from the header
  const token = req.headers["authorization"] ?? "";

  //decode token
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    return res.status(403).json({
      message: "Unauthorized user!",
    });
  }
};
