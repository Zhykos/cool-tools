<script setup lang="ts">
import { defineProps } from "vue";
import type { ProductDTO } from "@/dto/ProductDTO";
import { useProductStore } from "@/stores/shopStore";

const props = defineProps<{ products: ProductDTO[] }>();
const selectedProduct = useProductStore();

async function selectProduct(product: ProductDTO) {
    try {
        await selectedProduct.selectProduct(product);
    } catch (error) {
        alert(`Error selecting product: ${error}`);
        console.error(error);
    }
}
</script>

<template>
    <p v-if="props.products.length === 0" data-testid="product-list">No product</p>
    <p v-else data-testid="product-list">Select a product to put it on your basket</p>
    <ul>
        <li v-for="product in props.products" :key="product.uuid">
            <p>
                <a href="javascript:void(0)" @click="selectProduct(product)">{{
                    product.name
                }}</a>
                : <b>{{ product.price }}</b> / {{ product.description }} /
                <i>({{ product.uuid }})</i>
            </p>
        </li>
    </ul>
</template>
