<script setup lang="ts">
import { useUserStore } from "@/stores/shopStore";

const userWhoIsShopping = useUserStore();
</script>

<template>
    <p v-if="userWhoIsShopping.user">
        {{ JSON.stringify(userWhoIsShopping.user) }}
    </p>
    <p v-else>User not selected yet (select one below)</p>
</template>
