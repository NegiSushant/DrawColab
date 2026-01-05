import { useEffect, useRef, useState } from "react";
import { Game } from "../draw/Game";
import CanvasTopBar from "./CanvasTopBar";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export type Tool = "circle" | "rect" | "pencil";

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  // let existingShape: Shape[]  = getExistingShape(roomId);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <CanvasTopBar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
      />
    </div>
  );
};