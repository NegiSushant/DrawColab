import { Router } from "express";
import userRoute from "./auth";
import roomRoute from "./room";

const router: Router = Router();

router.use("/user", userRoute);
router.use("/chat", roomRoute);

export default router;
