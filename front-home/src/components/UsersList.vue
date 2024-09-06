<script setup lang="ts">
import { ref } from "vue";
import { UserDTO } from "@/dto/UserDTO";

const users = ref<UserDTO[]>([]);

try {
    fetch("http://localhost:9001/user").then((res) => {
        res.json().then((data) => {
            users.value = data;
        });
    });
} catch (err) {
    console.error(err);
}
</script>

<template>
    <h3>Users list:</h3>
    <ul>
        <li v-for="user in users" :key="user.uuid">
            <p>{{ user.name }} ({{ user.uuid }})</p>
        </li>
    </ul>
</template>
