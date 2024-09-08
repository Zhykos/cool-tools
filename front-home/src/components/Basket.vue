<script setup lang="ts">
import { useBasketStore } from "@/stores/shopStore";

const basketStore = useBasketStore();
</script>

<template>
    <p>
        {{
            basketStore.getBasket() ||
            "Select user and product (select them above)"
        }}
    </p>
</template>
