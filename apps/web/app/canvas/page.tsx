"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "../../config";
import { useRouter } from "next/navigation";

interface roomData {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export default function Canvas() {
  const [rooms, setRooms] = useState<roomData[]>([]);
  const router = useRouter();
  const getRooms = async () => {
    const token = localStorage.getItem("authorization");
    console.log(token);
    const response = await axios.get(`${HTTP_BACKEND}/api/room/room`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      setRooms(response.data.data ?? []);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className="min-h-screen bg-black text-amber-50 py-8">
      {/* Centered container */}
      <div className="mx-auto max-w-6xl px-6">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between rounded-xl border border-sky-400/60 p-4">
          <div className="flex flex-1 justify-end gap-3">
            <button className="rounded-lg border border-sky-400 px-4 py-2 text-sky-300 hover:bg-sky-400/10">
              Join Room
            </button>
            <button className="rounded-lg border border-sky-400 px-4 py-2 text-sky-300 hover:bg-sky-400/10">
              Create new room
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-6 text-center text-xl font-semibold text-sky-300">
          Available rooms
        </h2>

        {/* Table header */}
        <div className="grid grid-cols-12 border-b border-sky-400/40 pb-3 text-sky-300">
          <div className="col-span-1">S.No.</div>
          <div className="col-span-5">Room Name</div>
          <div className="col-span-4">Created At</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Table rows */}
        {rooms.length > 0 ? (
          rooms.map((room, i) => (
            <div
              key={room.id}
              className="grid grid-cols-12 items-center border-b border-white/10 py-4"
            >
              <div className="col-span-1">{i + 1}</div>
              <div className="col-span-5">{room.slug}</div>
              <div className="col-span-4">
                {new Date(room.createdAt).toLocaleString()}
              </div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => alert("tested")}
                  className="rounded-md border border-sky-400 px-3 py-1 text-sm text-sky-300 hover:bg-sky-400/10"
                >
                  Go to room
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400">
            No room created yet!
          </div>
        )}
      </div>
    </div>
  );
}
