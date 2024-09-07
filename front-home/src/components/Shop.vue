<script setup lang="ts">
import { ref } from "vue";
import type { UserDTO } from "@/dto/UserDTO";
import type { ProductDTO } from "@/dto/ProductDTO";
import CreateUser from "./CreateUser.vue";
import SelectedUser from "./SelectedUser.vue";
import ShopItem from "./ShopItem.vue";
import UsersList from "./UsersList.vue";
import { createUser, getUsers, getProducts } from "@/services/ShopService";
import ProductsList from "./ProductsList.vue";

const users = ref<UserDTO[]>([]);
const products = ref<ProductDTO[]>([]);

const userCreated = async (username: string) => {
    try {
        const data = await createUser(username);
        users.value.push(data);
        console.log("Created user:", data);
    } catch (err) {
        alert("Failed to create user");
        console.error(err);
    }
};

const initUsers = async () => {
    try {
        const data = await getUsers();
        users.value = data;
    } catch (err) {
        alert("Failed to get users");
        console.error(err);
    }
};

const initProducts = async () => {
    try {
        const data = await getProducts();
        products.value = data;
    } catch (err) {
        alert("Failed to get products");
        console.error(err);
    }
};

initUsers();
initProducts();
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
    <ShopItem>
        <template #heading>Product list</template>
        <ProductsList :products="products" />
    </ShopItem>
</template>
