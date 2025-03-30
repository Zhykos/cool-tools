<script setup lang="ts">
import type { BasketDTO } from "@/dto/BasketDTO";
import type { OrderDTO } from "@/dto/OrderDTO";
import { useBasketStore } from "@/stores/shopStore";
import { createOrder as createOrderService } from "@/services/ShopService";
import { computed, ref } from "vue";

const basketStore = useBasketStore();
basketStore.initBasket();
const orderDone = ref<OrderDTO>();

const invoicePdfUrl = computed(() => {
    return `http://localhost:9005/invoice/${orderDone.value?.OrderID}/download`;
});

async function createOrder() {
    const basket: BasketDTO | null = basketStore.basket;
    orderDone.value = undefined;
    if (basket) {
        orderDone.value = await createOrderService(basket);
    } else {
        alert("Basket is empty");
    }
}
</script>

<template>
    <div>
        <button @click="createOrder" data-testid="create-order">Create order</button>
    </div>
    <div v-if="orderDone?.OrderID" data-testid="pdf-div">
        Download PDF:
        <a :href="invoicePdfUrl" target="_blank" data-testid="pdf-link">{{ invoicePdfUrl }}</a>
    </div>
</template>
