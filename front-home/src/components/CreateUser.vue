<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
    (e: "userCreated", username: string): void;
}>();

const createUser = (event: Event) => {
    event.preventDefault();
    const username: string = event.target.username.value;
    if (username.length === 0) {
        alert("Please enter a username");
        return;
    }

    emit("userCreated", username);
};
</script>

<template>
    <div>
        <form @submit="createUser">
            <label for="username">Username</label>
            <input type="text" id="username" maxlength="255" />
            <button type="submit">Create user</button>
        </form>
    </div>
</template>

<style scoped>
label {
    margin-right: 10px;
}

input {
    margin-right: 10px;
}
</style>
