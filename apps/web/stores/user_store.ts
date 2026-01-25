import { User } from "@repo/types";
import { create } from "zustand";



type UserStore = {
    user: User | null,
    updateData: (user: User) => void
};


export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    async updateData(user) {
        set({ user })
    },
}))