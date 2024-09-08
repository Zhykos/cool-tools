<script setup lang="ts">
import type { BasketDTO } from "@/dto/BasketDTO";
import type { OrderDTO } from "@/dto/OrderDTO";
import { useBasketStore } from "@/stores/shopStore";
import { createOrder as createOrderService } from "@/services/ShopService";
import { ref } from "vue";

const basketStore = useBasketStore();
const orderDone = ref<OrderDTO>();

async function createOrder() {
    const basket: BasketDTO | null = await basketStore.getBasket();
    if (basket) {
        orderDone.value = await createOrderService(basket);
    } else {
        alert("Basket is empty");
    }
}
</script>

<template>
    <div>
        <button @click="createOrder">Create order</button>
    </div>
    <div>{{ orderDone }}</div>
</template>
