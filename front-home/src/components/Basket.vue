<script setup lang="ts">
import { useBasketStore } from "@/stores/shopStore";

const basketStore = useBasketStore();
basketStore.initBasket();
</script>

<template>
    <p v-if="basketStore.basket">
        {{ JSON.stringify(basketStore.basket) }}
    </p>
    <p v-else>Select user and product (select them above)</p>
</template>
