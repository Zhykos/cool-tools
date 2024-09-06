<script setup lang="ts">
import SelectedUser from "./SelectedUser.vue";
import ShopItem from "./ShopItem.vue";
import UsersList from "./UsersList.vue";
</script>

<template>
    <ShopItem>
        <template #heading>Selected user</template>
        <SelectedUser />
    </ShopItem>
    <ShopItem>
        <template #heading>Users list</template>
        <UsersList />
    </ShopItem>
</template>
