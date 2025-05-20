'use client'
import Canvas from "@/components/Canvas";
import UserTile from "@/components/UserTile";
import "./canvas.css"
import { useRouter, useSearchParams } from "next/navigation";
import { socket } from "@/socket";
import { useAuth } from "@/app/store";
import { useEffect, useState } from "react";
import PreLoader from "@/components/PreLoader";
import { toast } from "react-toastify";

const WIDTH: number = 1000;
const HEIGHT: number = 500;

export default function CanvasPage() {
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || null;
  const router = useRouter();
  const setAdmin = useAuth((s: any) => s.setAdmin);
  const [setRoomId, setRoomName] = useAuth((state: any) => [state.setRoomId, state.setRoomName]);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  function onConnect() {
    if (room == "new") {
      socket.emit("create");
      setAdmin(true);
    } else {
      socket.emit("join", room);
    }
  
    socket.on("joined", (roomId, users) => {
      setConnected(true);
      setRoomId(roomId);
      setUsers(users);
      setRoomName(roomId);
    })
    socket.on("rejected", () => {
      setConnected(false);
      toast.error("Room doesn't exist", { position: "top-center" });
      router.push("/");
    })
    socket.on("admin-disconnected", () => {
      setConnected(false);
      toast.error("Admin disconnected", { position: "top-center" });
      router.push("/");
    })

    socket.on("update-users", (users) => {
      setUsers(users);
    })
  }

  useEffect(() => {
    socket.auth = { token: localStorage.getItem('token') };
    if (socket.connected) onConnect();
    socket.on("connect", () => {
      onConnect();
    });
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    }
  }, [])

  if (room === null) {
    return router.push("/");
  }

  if (!connected) return <PreLoader />

  return (
    <div className="flex gap-4 h-full flex-col md:flex-row">
      <div className="w-full h-full flex items-center">
        <Canvas width={WIDTH} height={HEIGHT} className="w-full" />
      </div>
      <div className="mx-auto flex flex-col items-center md:w-56 justify-between w-full">
        <div className="relative md:overflow-y-scroll md:overflow-x-hidden flex md:block items-start justify-start overflow-x-scroll w-full">
          {users && users.map((user, id) => <UserTile key={id} name={user.name || user.email?.split("@")[0]} />)}
        </div>
        <div className="flex h-16 items-end w-44 gap-2">
          {/* <img src="/chat.svg" alt="user" className="p-2 h-9 hover:bg-[#CECAFF32] bg-[#CECAFF42] inline-block rounded-md" /> */}
          <button className="bg-red-600 hover:bg-red-700 p-1 text-lg mt-4 font-semibold w-full" onClick={() => {
            socket.disconnect();
            router.push("/");
          }}>Leave</button>
        </div>
      </div>
    </div>
  )
}
