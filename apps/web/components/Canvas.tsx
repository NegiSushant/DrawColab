"use client";
import { useEffect, useRef, useState } from "react";
import CanvasTopBar from "./CanvasTopBar";

export type Tool = "circle" | "rect" | "pencil" | "line";

type Shape =
  | {
      type: "circle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "line";
      startx: number;
      starty: number;
      endx: number;
      endy: number;
    };

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  useEffect(() => {
    setSelectedTool(selectedTool);
  }, [selectedTool]);
  // const ctx = canva.current?.getContext("2d");
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let startX = 0;
      let startY = 0;
      let clicked = false;

      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        console.log(`mouse down: ${startX}, ${startY}`);
      });

      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        console.log(`mouse up: ${e.clientX}, ${e.clientY}`);
      });

      canvas.addEventListener("mousemove", (e) => {
        console.log(selectedTool);
        if (clicked) {
          if (selectedTool === "rect") {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "white";
            // ctx.fillRect(startX, startY, width, height);
            ctx.strokeRect(startX, startY, width, height);
          } else if (selectedTool === "circle") {
            const height = e.clientY - startY;
            const width = e.clientX - startX;
            const radius = Math.max(width, height) / 2;
            const cx = radius + startX;
            const cy = radius + startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(cx, cy, Math.abs(radius), 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
          } else if (selectedTool === "line") {
            const lEX = e.clientX;
            const lEY = e.clientY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(lEX, lEY);
            ctx.stroke();
          } else if (selectedTool === "pencil") {
            const canOffsetX = canvas.offsetLeft;
            const canOffsetY = canvas.offsetTop;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineCap = "round";
            ctx.lineTo(e.clientX - canOffsetX, e.clientY);
            ctx.stroke();
          }
        }
      });
    }
  }, [canvasRef, selectedTool]);

  // ctx?.fillRect()

  return (
    <div className="min-h-max bg-black overflow-hidden">
      <CanvasTopBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
      <canvas ref={canvasRef} width={700} height={900} />
    </div>
  );
};

// import { useEffect, useRef, useState } from "react";
// import { Game } from "../draw/Game";
// import CanvasTopBar from "./CanvasTopBar";

// type Shape =
//   | {
//       type: "rect";
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     }
//   | {
//       type: "circle";
//       centerX: number;
//       centerY: number;
//       radius: number;
//     };

// export type Tool = "circle" | "rect" | "pencil";

// export const Canvas = ({
//   roomId,
//   socket,
// }: {
//   roomId: string;
//   socket: WebSocket;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [game, setGame] = useState<Game>();
//   const [selectedTool, setSelectedTool] = useState<Tool>("circle");
//   // let existingShape: Shape[]  = getExistingShape(roomId);

//   useEffect(() => {
//     game?.setTool(selectedTool);
//   }, [selectedTool, game]);

//   useEffect(() => {
//     if (canvasRef.current) {
//       const g = new Game(canvasRef.current, roomId, socket);
//       setGame(g);

//       return () => {
//         g.destroy();
//       };
//     }
//   }, [canvasRef, roomId, socket]);

//   return (
//     <div
//       style={{
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       <canvas
//         ref={canvasRef}
//         width={window.innerWidth}
//         height={window.innerHeight}
//       ></canvas>
//       <CanvasTopBar
//         setSelectedTool={setSelectedTool}
//         selectedTool={selectedTool}
//       />
//     </div>
//   );
// };
