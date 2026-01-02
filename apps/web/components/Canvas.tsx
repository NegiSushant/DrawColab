export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  return (
    <div className="min-h-screen bg-black text-2xl text-amber-50">
      hello from room: {roomId}
    </div>
  );
};
