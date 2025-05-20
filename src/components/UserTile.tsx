export default function UserTile({ name }: { name: string }) {
  return (
    <div className="m-1 w-44 h-28 bg-[#C6D2DD3C] rounded-lg flex flex-col items-center justify-center shadow-tile">
      <div className="w-16 h-16 bg-[#4617A938] p-3 rounded-full">
        <img src="/user.svg" alt="user" className="w-full h-full" />
      </div>
      <h3 className="w-[70%] overflow-x-hidden overflow-ellipsis">{name}</h3>
    </div>
  );
}