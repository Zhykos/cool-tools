<script setup lang="ts">
import { useBasketStore } from "@/stores/shopStore";

const basketStore = useBasketStore();
</script>

<template>
    <p>
        {{
            basketStore.getBasket() ||
            "Product not selected yet (select one above)"
        }}
    </p>
</template>
