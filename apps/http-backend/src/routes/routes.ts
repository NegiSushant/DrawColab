import { Router } from "express";
import userRoute from "./auth";
import roomRoute from "./room";

const router: Router = Router();

router.use("/user", userRoute);
router.use("/room", roomRoute);

export default router;
