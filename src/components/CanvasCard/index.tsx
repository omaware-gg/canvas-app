import CanvasThumbnail from "@/assets/images/canvas-thumbnail.png";
import Image from "next/image";
import localFont from "next/font/local";
// import PostNoBills from "@/assets/fonts/post-no-bills/postnobillscolombo-extrabold.ttf";

const myFont = localFont({ src: "../../assets/fonts/post-no-bills/postnobillscolombo-extrabold.ttf" });

export default function CanvasCard({ canvas, className }: { canvas: any, width?: number, height?: number, className?: string }) {
  return (
    <div className={`h-28 w-32 sm:h-32 lg:h-36 sm:w-36 xl:w-44 relative ${className || ""}`}>
      <div className="w-full h-full bg-black opacity-[0.56] absolute"></div>
      <div className="w-full h-full -rotate-[8deg] bg-[#D9D9D9] p-3 flex justify-between flex-col">
        <Image src={canvas?.dataUrl} alt="Thumbnail" className="w-full bg-white" width={100} height={50} />
        <p className={`${myFont.className} text-black text-lg lg:text-xl my-2 w-full overflow-hidden overflow-ellipsis`}>{canvas?.name || ""}</p>
      </div>
    </div>
  );
}