import { defineStore } from "pinia";
import type { UserDTO } from "@/dto/UserDTO";
import type { ProductDTO } from "@/dto/ProductDTO";
import {
  createBasket,
  getBasket as getBasketService,
} from "@/services/ShopService";
import type { BasketDTO } from "@/dto/BasketDTO";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserDTO | null,
  }),
});

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null as ProductDTO | null,
  }),
  actions: {
    async selectProduct(product: ProductDTO) {
      const userStore = useUserStore();
      const basketStore = useBasketStore();

      if (!userStore.user) {
        throw new Error("User not selected");
      }

      this.product = product;
      const basket: BasketDTO = await createBasket(userStore.user, product);
      basketStore.$patch({ basket });
    },
  },
});

export const useBasketStore = defineStore("basket", {
  state: () => ({
    basket: null as BasketDTO | null,
  }),
  actions: {
    initBasket() {
      if (!this.basket) {
        const userStore = useUserStore();
        if (userStore.user) {
          getBasketService(userStore.user).then((basket) => {
            this.basket = basket;
          });
        }
      }
    },
  },
});
