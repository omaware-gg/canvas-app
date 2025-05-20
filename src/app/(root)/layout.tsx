'use client'
import { Reggae_One } from "next/font/google";
import { useAuth } from "../store";
import { useEffect, useState } from "react";
import { ifetch, validateToken } from "../services/utils";
import PreLoader from "@/components/PreLoader";
import Link from "next/link";
import { usePathname } from "next/navigation";

const reggaeOne = Reggae_One({ weight: ["400"], subsets: ["latin"] });

export default function Layout({ children }: { children: any }) {
  const [setUser] = useAuth((state: any) => [state.setUser]);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const user = await validateToken(token || "");
      if (user) setUser(user);
      setFetching(false);
    })();
  }, [setUser]);

  if (fetching) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <PreLoader />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="p-2 sm:p-2 md:p-4 flex-1 overflow-hidden">
        {children}
      </main>
    </>
  );
}

function Header() {
  const [user, setUser, roomName, setRoomName, setSave, saving] = useAuth((s: any) => [s.user, s.setUser, s.roomName, s.setRoomName, s.setSave, s.saving]);
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <header className="flex justify-between items-center bg-[#CCC5E7] px-2 md:px-5 text-lg w-full py-2 overflow-hidden">
      <h1 className={`${reggaeOne.className} text-xl lg:text-3xl text-black`}><Link href={"/"}>Canvas</Link></h1>
      {/* {pathname === "/canvas" &&
        <div>
          <input className="text-black w-56 font-bold bg-transparent focus-visible:outline-none" value={roomName} onChange={e => setRoomName(e.target.value)} />
          <button
            className={`${saving ? "bg-gray-400" : "bg-green-600"} p-1 px-3 rounded-lg`} disabled={saving}
            onClick={() => setSave(true)}
          >{saving ? "Saving..." : "Save"}</button>
        </div>
      } */}
      {user ?
        <div className="flex gap-1 hover:bg-[#9893d357] active:opacity-80 rounded-lg cursor-default" onClick={() => setShowPopup(true)}>
          <div className="text-left flex flex-col text-black justify-evenly">
            <h2 className="leading-none text-md lg:text-xl font-medium">{user.name || user.email?.split("@")[0]}</h2>
            <p className="leading-none text-sm">{user.email}</p>
          </div>
          <img src="/user.svg" alt="" className="h-9 rounded-full bg-gray-400 p-2" />
        </div>
        :
        <button className="p-1.5 md:p-2 px-2 md:px-4 lg:px-5 bg-[#763CF0] rounded-md font-semibold text-sm md:text-md lg:text-xl"><Link href={user ? "" : "/login"}>{user ? (user.name || user.email?.split("@")[0]) : "Sign In"}</Link></button>
      }
      {showPopup && <Popup user={user} setUser={setUser} setShowPopup={setShowPopup} />}
    </header>
  )
}

function Popup({ user, setUser, setShowPopup }: { user: any, setUser: any, setShowPopup: any }) {
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  return (
    <div id="popup" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 text-black" onClick={() => setShowPopup(false)}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full" onClick={(e: any) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">User Settings</h2>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Update Name</label>
        <input type="text" id="username" placeholder="Add name" value={name} onChange={(e: any) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className={`${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-md font-medium`}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const response = await ifetch("/api/name", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name })
              })
              if (response?.data?.user) setUser(response.data.user);
              setLoading(false);
            }}
          >{loading ? "Updating..." : "Update"}</button>
        </div>
        <hr className="my-4 m-auto" />
        <button onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
          setShowPopup(false);
        }} className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
      </div>
    </div>
  )
}