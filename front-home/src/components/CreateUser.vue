<script setup lang="ts">
import { defineEmits, ref } from "vue";

const emit = defineEmits<(e: "userCreated", username: string) => void>();

const username = ref("");

const createUser = () => {
    if (username.value.length === 0) {
        alert("Please enter a username");
        return;
    }

    emit("userCreated", username.value);
};
</script>

<template>
    <div>
        <label for="username">Username</label>
        <input type="text" id="username" maxlength="255" v-model="username" data-testid="username-input" />
        <button type="submit" @click="createUser" data-testid="create-user-button">Create user</button>
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
