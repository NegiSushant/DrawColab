"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "../../config";

interface roomData {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export default function Canvas() {
  const [rooms, setRooms] = useState<roomData[]>([]);
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
    <div className="min-h-screen bg-black text-amber-50">
      <div className="flex flex-1 justify-self-end-safe">
        <div className="">Create New Room</div>
        <div>Join Existing Room</div>
      </div>
      <div className="justify-center">Available Rooms</div>
      <div>
        {rooms.length > 0 ? (
          rooms.map((item) => (
            <div key={item.id}>
              <p>
                <strong>Slug:</strong> {item.slug}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div>No room created yet!</div>
        )}
      </div>
    </div>
  );
}
