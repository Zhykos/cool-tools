<script setup lang="ts">
import { useBasketStore } from "@/stores/shopStore";

const basketStore = useBasketStore();
basketStore.initBasket();
</script>

<template>
    <p v-if="basketStore.basket" data-testid="basket">
        {{ JSON.stringify(basketStore.basket) }}
    </p>
    <p v-else data-testid="basket">Select user and product (select them above)</p>
</template>
