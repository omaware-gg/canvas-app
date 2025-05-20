import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null as any,
  setUser: (user: any) => set({ user }),
  admin: false,
  setAdmin: (admin: boolean) => set({ admin }),
  roomId: null as string|null,
  setRoomId: (roomId: string|null) => set({ roomId }),
  canvasTitle: "",
  setCanvasTitle: (title: string) => set({ canvasTitle: title }),
  roomName: "",
  setRoomName: (roomName: string) => set({ roomName }),
  save: false,
  setSave: (save: boolean) => set({ save }),
  saving: false,
  setSaving: (saving: boolean) => set({ saving }),
}))