import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/config";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";

const userRoute: Router = Router();

//User signUp route
userRoute.post("/signUp", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect Input",
    });
  }

  try {
    const password = parsedData.data.password;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashPassword,
        name: parsedData.data.name,
      },
    });
    return res.status(200).json({
      userId: user.id,
    });
  } catch (e) {
    return res.status(411).json({
      message: e,
    });
  }
});

//User signin route
userRoute.post("/signIn", async (req: Request, res: Response) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(404).json({
        message: "Incorrect input",
      });
    }
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        // password: parsedData.data.password,
      },
    });

    if (!user) {
      return res.status(403).json({
        message: "User does not exist!",
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(403).json({
        message: "Wrong credentials!",
      });
    }
    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );
    return res.status(200).json({
      token,
    });
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
});

export default userRoute;
