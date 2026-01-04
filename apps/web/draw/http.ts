import axios from "axios";
import { HTTP_BACKEND } from "../config";

export async function getExistingShapes(roomId: string) {
  const result = await axios.get(`${HTTP_BACKEND}/api/room/chat/${roomId}`);

  const messages = result.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
