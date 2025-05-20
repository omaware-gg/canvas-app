'use client'
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { socket } from "../socket";
import { useAuth } from "@/app/store";
import { ifetch } from "@/app/services/utils";

export default function Canvas({ width, height, className }: { width: number, height: number, className?: string }) {
  const [selectedController, setSelectedController] = useState<"brush" | "eraser">("brush");
  const [cursorOrigin, setCursorOrigin] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [thickness, setThicknesss] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThicknessSelector, setShowThicknessSelector] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [isconnected, setIsConnected] = useState(false);
  const [admin, roomId, roomName, setUser, save, setSave, setSaving] = useAuth((s: any) => [s.admin, s.roomId, s.roomName, s.setUser, s.save, s.setSave, s.setSaving]);
  let ctx = canvasRef.current?.getContext('2d');

  const getX = (x: number) => {
    return x / (canvasRef.current!.getBoundingClientRect().width / width);
  }

  const getY = (y: number) => {
    return y / (canvasRef.current!.getBoundingClientRect().height / height);
  }

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("draw", (type: string, ...args: any[]) => {
      switch (type) {
        case "lineTo":
          ctx!.lineWidth = args[3];
          ctx!.strokeStyle = args[2];
          ctx!.lineTo(args[0], args[1]);
          ctx!.stroke();
          break;
        case "moveTo":
          ctx!.strokeStyle = args[2];
          ctx!.beginPath();
          ctx!.moveTo(args[0], args[1]);
          break;
        case "dot":
          ctx!.lineWidth = args[3];
          ctx!.fillStyle = args[2];
          ctx!.arc(args[0], args[1], args[3], 0, Math.PI * 2);
          ctx!.fill();
          break;
        case "erase":
          ctx!.clearRect(args[0] - 16, args[1] - 16, 32, 32);
          break;
      }
    })

    socket.on("get-canvas-data", () => {
      if (admin) socket.emit("canvas-data", canvasRef!.current?.toDataURL());
    })

    socket.on("canvas-data", (dataUrl) => {
      const img = new Image();
      img.onload = function () {
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    })

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx!.strokeStyle = color;
    let mouseDown = false;
    let drag = false;

    function mouseDownFunc(e: MouseEvent) {
      mouseDown = true;
      drag = false;
      switch (selectedController) {
        case "brush":
          ctx!.beginPath();
          ctx!.moveTo(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top));
          sendMoveTo(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), color);
          break;
      }
    }

    function mouseUpFunc(e: MouseEvent) {
      mouseDown = false;
    }

    function mouseMoveFunc(e: MouseEvent) {
      if (!mouseDown) {
        return;
      }
      drag = true;
      switch (selectedController) {
        case "brush":
          ctx!.strokeStyle = color;
          ctx!.lineWidth = thickness;
          ctx!.lineTo(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top));
          ctx!.stroke();
          sendLineTo(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), thickness, color);
          break;
        case "eraser":
          ctx!.clearRect(getX(e.clientX - canvas!.getBoundingClientRect().left) - 16, getY(e.clientY - canvas!.getBoundingClientRect().top) - 16, 32, 32);
          sendErase(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), color);
          break;
      }
    }

    function clickFunc(e: MouseEvent) {
      if (drag) return;
      switch (selectedController) {
        case "brush":
          ctx!.lineWidth = thickness;
          ctx!.fillStyle = color;
          ctx!.arc(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), thickness, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.fill();
          sendDot(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), thickness, color);
          break;
        case "eraser":
          ctx!.clearRect(getX(e.clientX - canvas!.getBoundingClientRect().left) - 16, getY(e.clientY - canvas!.getBoundingClientRect().top) - 16, 32, 32);
          sendErase(getX(e.clientX - canvas!.getBoundingClientRect().left), getY(e.clientY - canvas!.getBoundingClientRect().top), color);
          break;
      }
    }

    async function hideColorPicker(e: MouseEvent) {
      setShowColorPicker(false);
      setShowThicknessSelector(false);
    }

    canvas!.addEventListener("mousedown", mouseDownFunc)
    canvas!.addEventListener("mouseup", mouseUpFunc)
    canvas!.addEventListener("mousemove", mouseMoveFunc);
    canvas!.addEventListener("click", clickFunc);
    window.addEventListener("mousedown", hideColorPicker);

    return () => {
      canvas!.removeEventListener("mousedown", mouseDownFunc)
      canvas!.removeEventListener("mouseup", mouseUpFunc)
      canvas!.removeEventListener("mousemove", mouseMoveFunc);
      canvas!.removeEventListener("click", clickFunc);
      window.removeEventListener("mousedown", hideColorPicker);
    }
  }, [canvasRef, selectedController, color, thickness])

  function sendLineTo(x: number, y: number, thickness: number, color: string) {
    socket.emit("draw", "lineTo", x, y, color, thickness);
  }

  function sendMoveTo(x: number, y: number, color: string) {
    socket.emit("draw", "moveTo", x, y, color);
  }

  function sendDot(x: number, y: number, thickness: number, color: string) {
    socket.emit("draw", "dot", x, y, color, thickness);
  }

  function sendErase(x: number, y: number, color: string) {
    socket.emit("draw", "erase", x, y, color);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx!.lineWidth = thickness;
  }, [thickness])

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!save) return;
    setSaving(false);
    setSave(false);
    (async () => {
      setSaving(true);
      const response = await ifetch("/api/canvas/save", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: roomName,
          dataUrl: canvasRef.current!.toDataURL(),
        })
      })
      if (response?.data?.user) setUser(response.data.user);
      setSaving(false);
    })();
  }, [save]);

  useEffect(() => {
    setCursorOrigin(() => {
      switch (selectedController) {
        case "brush":
          return { x: 0, y: 20 }
        case "eraser":
          return { x: 16, y: 16 }
      }
    })
  }, [selectedController])

  return (
    <div className={className + " flex flex-col gap-1 justify-center h-[inherit]"}>
      <div className="flex md:gap-1 flex-wrap">
        <div className="hidden md:flex">
          <img src="/brush.png" alt="" className={`w-8 p-1 ${selectedController == "brush" && "bg-[#CECAFF42]"} rounded-md`} onClick={() => setSelectedController("brush")} />
          <img src="/eraser.png" alt="" className={`w-8 p-1 ${selectedController == "eraser" && "bg-[#CECAFF42]"} rounded-md`} onClick={() => setSelectedController("eraser")} />
          <div className={`w-8 p-1 rounded-md relative ${showThicknessSelector && "bg-[#CECAFF42]"}`} onMouseDown={(e: any) => e.stopPropagation()}>
            <img src="/thickness-selector.png" alt="" onClick={() => setShowThicknessSelector(p => !p)} />
            {showThicknessSelector && <div className="absolute p-2 px-3 bg-[#CECAFFCC] shadow  rounded-full mt-3">
              <input type="range" min={1} max={100} value={thickness} onChange={(e: any) => setThicknesss(e.target?.value ?? 0)} />
            </div>}
          </div>
        <div className={`w-8 p-1.5 rounded-md relative ${showColorPicker && "bg-[#CECAFF42]"}`} onMouseDown={(e: any) => e.stopPropagation()}>
          <div className={`w-full h-full`} style={{ backgroundColor: color }} onClick={() => setShowColorPicker(p => !p)}></div>
          {showColorPicker && <div className={`absolute mt-2 shadow-md`}>
            <HexColorPicker color={color} onChange={setColor} className="!cursor-crosshair" />
          </div>}
        </div>
        </div>
        <p className={"px-2 py-1 font-bold " + (isconnected ? "text-green-500" : "text-red-500")}>{isconnected ? "Connected" : "Not connected"}</p>
        <p className="px-2 py-1 whitespace-nowrap">Room ID: {roomId}</p>
      </div>
      <canvas ref={canvasRef} width={width} height={height} className={`bg-white w-full aspect-[2/1] cursor-brush`} style={{ cursor: `url('http://localhost:3000/${selectedController}.png') ${cursorOrigin.x} ${cursorOrigin.y}, auto` }}></canvas>
    </div>
  );
}