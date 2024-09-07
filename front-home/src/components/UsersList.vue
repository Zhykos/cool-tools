<script setup lang="ts">
import { ref, defineProps } from "vue";
import { UserDTO } from "@/dto/UserDTO";
import { useUserStore } from "@/stores/shopStore";

const props = defineProps<{ users: UserDTO[] }>();
const users = ref<UserDTO[]>([]);
const userWhoIsShopping = useUserStore();

function selectUser(user: UserDTO) {
    userWhoIsShopping.$patch({ user });
}
</script>

<template>
    <p v-if="props.users.length === 0">No user: create a new one above</p>
    <ul>
        <li v-for="user in props.users" :key="user.uuid">
            <p>
                <a href="#" @click="selectUser(user)">{{ user.name }}</a>
                <i>({{ user.uuid }})</i>
            </p>
        </li>
    </ul>
</template>
