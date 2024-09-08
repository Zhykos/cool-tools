<script setup lang="ts">
import type { BasketDTO } from "@/dto/BasketDTO";
import { useBasketStore } from "@/stores/shopStore";
import { createOrder as createOrderService } from "@/services/ShopService";

const basketStore = useBasketStore();

async function createOrder() {
    const basket: BasketDTO | null = await basketStore.getBasket();
    if (basket) {
        createOrderService(basket);
    } else {
        alert("Basket is empty");
    }
}
</script>

<template>
    <button @click="createOrder">Create order</button>
</template>
