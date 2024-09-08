<script setup lang="ts">
import { useBasketStore } from "@/stores/shopStore";

const basketStore = useBasketStore();
</script>

<template>
    <p>
        {{
            basketStore.basket || "Product not selected yet (select one above)"
        }}
    </p>
</template>
