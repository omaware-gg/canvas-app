'use client'
import CanvasCard from "@/components/CanvasCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../store";

export default function HomePage() {
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [roomId, setRoomId] = useState("");
  const user = useAuth((s: any) => s.user);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center xl:grid lg:grid-cols-2 justify-center w-fit m-auto gap-0 md:py-20 h-full">
      <div className="flex items-center justify-center h-full w-[80%]">
        <div className="m-auto text-center flex-1">
          <img src="/logo.svg" alt="logo" className="w-[90vw] sm:w-[60vw] lg:w-[35vw] m-auto px-10 box-border" />
          <p className="text-xl text-ce mt-4 w-full">Create a room and start drawing live or join other room and watch others drawing.</p>
          <div className="flex flex-col m-auto my-20 gap-4 md:gap-4 items-center">
            {showRoomInput ?
              <div className={`w-3/4 border-b-2 border-white m-2 px-1 text-xl flex`}>
                <input type="text" placeholder={"Enter Room ID"} className={`w-full bg-transparent text-white placeholder:text-gray-100 focus-visible:outline-none`} value={roomId} onChange={e => setRoomId(e.target.value)} />
                <p className="cursor-pointer" onClick={() => {
                  setShowRoomInput(false);
                  setRoomId("");
                }}>&#10005;</p>
              </div>
              :
              <button className="hover:scale-105 transition-all p-2 px-6 font-medium rounded-md text-lg sm:text-xl md:text-2xl w-max bg-[#BCBC74]"><Link href={"/canvas?room=new"}>+ New Canvas</Link></button>}
            <button
              className="hover:scale-105 transition-all p-2 px-6 font-medium rounded-md text-lg sm:text-xl md:text-2xl w-max border border-white"
              onClick={() => showRoomInput ? router.push("/canvas?room=" + roomId) : setShowRoomInput(true)}
            >Join Room</button>
          </div>
        </div>
      </div>

      <div className="w-fit sm:pr-8 m-auto flex sm:block items-center flex-col h-full overflow-hidden">
        <h3 className="text-2xl sm:text-3xl m-4 mt-4 text-[#E0FFFF] self-start">Your Recent Drawings:</h3>
        {user ?
          (user.canvases?.length > 0 ?
            <div className="p-4 sm:px-8 m-4 grid sm:grid-cols-3 grid-cols-2 gap-12 sm:gap-10 lg:gap-16 w-fit h-full overflow-y-scroll pb-20">
              {user && user.canvases?.map((canvas: any, id: number) => <CanvasCard key={id} canvas={canvas} />)}
            </div>
            :
            <div className="p-4 sm:px-8 m-4 text-center">
              <img src="/no-canvas-found.png" alt="" className="w-[60%] m-auto" />
              <p className="text-gray-300 text-sm">No Saved canvases found</p>
            </div>
          )
          :
          <div className="p-4 sm:px-8 m-4 text-center">
            <img src="/no-canvas-found.png" alt="" className="w-[60%] m-auto" />
            <p className="text-gray-300 text-sm">Please Sign in to create and save canvases</p>
          </div>
        }
      </div>
    </div>
  );
}