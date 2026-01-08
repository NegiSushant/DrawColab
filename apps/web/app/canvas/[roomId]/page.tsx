import RoomCanvas from "../../../components/CreateCanvas";

export default async function CanvasPage({
  params,
}: {
  params: { roomId: string };
}) {
  const roomId = (await params).roomId;
  return <RoomCanvas roomId={roomId} />;
}

// "use client";

// import { useEffect, useRef } from "react";

// // import RoomCanvas from "../../../components/CreateCanvas";
// // async
// export default function CanvasPage({ params }: { params: { roomId: string } }) {
//   // const roomId = (await params).roomId;
//   const roomId = params.roomId;
//   console.log(roomId);
//   // return <RoomCanvas roomId={roomId as string} />;
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       if (!ctx) return;

//       let clicked = false;
//       let startX = 0;
//       let startY = 0;

//       canvas.addEventListener("mousedown", (e) => {
//         clicked = true;
//         startX = e.clientX;
//         startY = e.clientY;
//         console.log(`mouse down: ${startX}, ${startY}`);
//       });

//       canvas.addEventListener("mouseup", (e) => {
//         clicked = false;
//         console.log(`mouse up: ${e.clientX}, ${e.clientY}`);
//       });

//       canvas.addEventListener("mousemove", (e) => {
//         if (clicked) {
//           const width = e.clientX - startX;
//           const height = e.clientY - startY;
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           // ctx.strokeStyle = "rgba(255, 255, 255)";
//           ctx.strokeStyle = "white";
//           // ctx.fillRect(startX, startY, width, height);
//           ctx.strokeRect(startX, startY, width, height);
//         }
//       });
//     }
//   }, [canvasRef]);

//   return (
//     <div className="min-h-screen bg-black h-screen overflow-hidden">
//       <canvas
//         ref={canvasRef}
//         height={700}
//         width={900}
//       ></canvas>
//     </div>
//   );
// }
