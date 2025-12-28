import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const roomRoute: Router = Router();

roomRoute.post("/create", middleware, async (req: Request, res: Response) => {
  //parsed the data
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(403).json({
      message: "Invalid Input!",
    });
  }
  // get user id
  const userId = req.userId;

  //create room and return roomId
  try {
    const room = await prismaClient.room.create({
      //@ts-ignore
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    return res.status(200).json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: e as string,
    });
  }
});

roomRoute.get("/chat/:roomId", async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 500,
    });

    return res.status(200).json({
      messages,
    });
  } catch {
    return res.status(403).json({
      messages: [],
    });
  }
});

roomRoute.get("/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });
  return res.status(200).json({
    room,
  });
});

export default roomRoute;
