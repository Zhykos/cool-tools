<script setup lang="ts">
import ShopItem from "./ShopItem.vue";
import UsersList from "./UsersList.vue";
</script>

<template>
    <ShopItem>
        <template #heading>Users</template>
        <UsersList />
    </ShopItem>
</template>
