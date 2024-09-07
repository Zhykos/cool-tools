<script setup lang="ts">
import { defineProps } from "vue";
import type { ProductDTO } from "@/dto/ProductDTO";

const props = defineProps<{ products: ProductDTO[] }>();
</script>

<template>
    <p v-if="props.products.length === 0">No product</p>
    <p v-else>Select a product to put it on your basket</p>
    <ul>
        <li v-for="product in props.products" :key="product.uuid">
            <p>
                <a href="#">{{ product.name }}</a> :
                <b>{{ product.price }}</b> / {{ product.description }} /
                <i>({{ product.uuid }})</i>
            </p>
        </li>
    </ul>
</template>
