import { useEffect, useRef, useState } from "react";
import { Game } from "../draw/Game";

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
  const [selectedTol, setSelectedTool] = useState<Tool>("circle");
  // let existingShape: Shape[]  = getExistingShape(roomId);

  useEffect(() => {
    game?.setTool(selectedTol);
  }, [selectedTol, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  // return (
  //   <div className="min-h-screen bg-black text-2xl text-amber-50">
  //     {/* hello from room: {roomId} */}
  //     <canvas ref={canvasRef} width={1000} height={1000} />
  //   </div>
  // );

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
      {/* <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} /> */}
    </div>
  );
};

// function Topbar({
//   selectedTool,
//   setSelectedTool,
// }: {
//   selectedTool: Tool;
//   setSelectedTool: (s: Tool) => void;
// }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 10,
//         left: 10,
//       }}
//     >
//       <div className="flex gap-t">
//         <IconButton
//           onClick={() => {
//             setSelectedTool("pencil");
//           }}
//           activated={selectedTool === "pencil"}
//           icon={<Pencil />}
//         />
//         <IconButton
//           onClick={() => {
//             setSelectedTool("rect");
//           }}
//           activated={selectedTool === "rect"}
//           icon={<RectangleHorizontalIcon />}
//         ></IconButton>
//         <IconButton
//           onClick={() => {
//             setSelectedTool("circle");
//           }}
//           activated={selectedTool === "circle"}
//           icon={<Circle />}
//         ></IconButton>
//       </div>
//     </div>
//   );
// }
