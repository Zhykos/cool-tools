import { defineStore } from "pinia";
import type { UserDTO } from "@/dto/UserDTO";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null as UserDTO | null,
    };
  },
});
