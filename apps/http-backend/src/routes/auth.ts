import { Request, Response, Router } from "express";
import { JWT_SECRET } from "@repo/backend-config/config";

const userRoute: Router = Router();

userRoute.post("/signIn", async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    return res.status(200).json({
      status: "success",
      message: { username, password },
    });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: e,
    });
  }
});

userRoute.post("/signUp", async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    //Check weather user already exist or not
    return res.status(200).json({
      status: "success",
      message: { username, password },
    });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: e,
    });
  }
});

// export { userRoute };
export default userRoute;
