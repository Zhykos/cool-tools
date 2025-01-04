<script setup lang="ts">
import { defineProps } from "vue";
import type { UserDTO } from "@/dto/UserDTO";
import { useUserStore } from "@/stores/shopStore";

const props = defineProps<{ users: UserDTO[] }>();
const userWhoIsShopping = useUserStore();

function selectUser(user: UserDTO) {
    userWhoIsShopping.$patch({ user });
}
</script>

<template>
    <p v-if="props.users.length === 0" data-testid="user-list-title">No user: create a new one above</p>
    <p v-else data-testid="user-list-title">Click on a user to select it</p>
    <ul data-testid="user-list" role="list">
        <li v-for="user in props.users" :key="user.uuid">
            <p :data-testid="'user-' + user.uuid" role="listitem">
                <a href="javascript:void(0)" @click="selectUser(user)">{{
                    user.name
                }}</a>
                <i>({{ user.uuid }})</i>
            </p>
        </li>
    </ul>
</template>
