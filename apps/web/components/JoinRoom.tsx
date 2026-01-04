import { useState } from "react";

interface JoinRoomProps {
  onClose: () => void;
  onJoinRoom: (room: any) => void;
}
export default function JoinRoom({ onClose, onJoinRoom }: JoinRoomProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomName, setRoomName] = useState("");

  const joinExistingRoom = async () => {
    if(!roomName) return;
    setIsLoading(true);

  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 text-white">
        <h3 className="mb-4 text-lg font-semibold">Join Room</h3>

        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="mb-4 w-full rounded-md bg-black px-3 py-2 text-white outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-500 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={joinExistingRoom}
            disabled={isLoading}
            className="rounded-md border border-sky-400 px-4 py-2 text-sm text-sky-300 hover:bg-sky-400/10"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
