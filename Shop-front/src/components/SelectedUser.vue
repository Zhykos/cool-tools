<script setup lang="ts">
import { useUserStore } from "@/stores/shopStore";

const userWhoIsShopping = useUserStore();
</script>

<template>
    <p v-if="userWhoIsShopping.user" data-testid="selected-user">
        {{ JSON.stringify(userWhoIsShopping.user) }}
    </p>
    <p v-else data-testid="selected-user">User not selected yet (select one below)</p>
</template>
