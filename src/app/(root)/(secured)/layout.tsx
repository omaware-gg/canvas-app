'use client'
import { useAuth } from "@/app/store";
import { useRouter } from "next/navigation";

export default function Secured({ children }: { children: any }) {
  const user = useAuth((s: any) => s.user);
  const router = useRouter();

  if (!user) {
    return router.push("/login");
  } else {
    return children;
  }

}