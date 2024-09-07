<script setup lang="ts">
import { ref } from "vue";
import type { UserDTO } from "@/dto/UserDTO";
import CreateUser from "./CreateUser.vue";
import SelectedUser from "./SelectedUser.vue";
import ShopItem from "./ShopItem.vue";
import UsersList from "./UsersList.vue";

const users = ref<UserDTO[]>([]);

const userCreated = async (username: string) => {
    try {
        const res = await fetch("http://localhost:9001/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: username }),
        });

        const data = await res.json();
        users.value.push(data);
        console.log("Created user:", data);
    } catch (err) {
        alert("Failed to create user");
        console.error(err);
    }
};

const initUsers = async () => {
    try {
        const res = await fetch("http://localhost:9001/user");
        const data = await res.json();
        users.value = data;
    } catch (err) {
        alert("Failed to get users");
        console.error(err);
    }
};

initUsers();
</script>

<template>
    <ShopItem>
        <template #heading>Selected user</template>
        <SelectedUser />
    </ShopItem>
    <ShopItem>
        <template #heading>Create a new user</template>
        <CreateUser @user-created="userCreated" />
    </ShopItem>
    <ShopItem>
        <template #heading>Users list</template>
        <UsersList :users="users" />
    </ShopItem>
</template>
