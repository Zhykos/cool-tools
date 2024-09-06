<script setup lang="ts">
import { ref } from "vue";
import { UserDTO } from "@/dto/UserDTO";
import { useUserStore } from "@/stores/shopStore";

const users = ref<UserDTO[]>([]);
const userWhoIsShopping = useUserStore();

try {
    fetch("http://localhost:9001/user").then((res) => {
        res.json().then((data) => {
            users.value = data;
        });
    });
} catch (err) {
    console.error(err);
}

function selectUser(user: UserDTO) {
    userWhoIsShopping.$patch({ user });
    console.log(user.name);
}
</script>

<template>
    <p v-if="users.length === 0">No user: create a new one above</p>
    <ul>
        <li v-for="user in users" :key="user.uuid">
            <p>
                <a href="#" @click="selectUser(user)">{{ user.name }}</a>
                <i>({{ user.uuid }})</i>
            </p>
        </li>
    </ul>
</template>
