import { Request, Response, Router } from "express";
import { middleware } from "../middleware";

const roomRoute: Router = Router();

roomRoute.post("/room", middleware, async (req: Request, res: Response) => {});

export default roomRoute;
