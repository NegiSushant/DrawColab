import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/config";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import prismaClient from "@repo/db/client";

const userRoute: Router = Router();

userRoute.post("/signIn", async (req: Request, res: Response) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);
    // const username = req.body.username;
    // const password = req.body.password;
    if (!parsedData.success) {
      return res.status(404).json({
        status: "fail",
        message: "Incorrect input",
      });
    }
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User does not exist!",
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
    // return res.status(200).json({
    //   status: "success",
    //   message: { username, password },
    // });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: e,
    });
  }
});

userRoute.post("/signUp", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(404).json({
      status: "fail",
      message: "Incorrect Input",
    });
  }

  try {
    console.log(parsedData.data);
    const password = parsedData.data.password;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashPassword,
        name: parsedData.data.name,
      },
    });
    //Check weather user already exist or not
    return res.status(200).json({
      message: "success",
      userId: user.id,
    });
  } catch (e) {
    return res.status(411).json({
      status: "failed",
      message: e,
    });
  }
});

// export { userRoute };
export default userRoute;
