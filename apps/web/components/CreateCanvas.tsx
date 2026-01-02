"use client";
import { useEffect, useState } from "react";
import { WS } from "../config";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("authorization");
    const ws = new WebSocket(`${WS}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }
  
  return (
    <div className="min-h-screen bg-black text-2xl text-amber-50">
      hello from room: {roomId}
    </div>
  );
}
