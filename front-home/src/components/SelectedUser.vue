<script setup lang="ts">
import { useUserStore } from "@/stores/shopStore";

const userWhoIsShopping = useUserStore();
</script>

<template>
    <p>
        {{
            userWhoIsShopping.user ||
            "User not selected yet (select one below or create a new one)"
        }}
    </p>
</template>
