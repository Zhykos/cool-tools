<template>
    <div class="greetings">
        <h1 class="green">Cool Tools</h1>
        <h3>
            A cool front web app to present to you the power of cool tools. This
            project is a application generated and modified from the Vue 3
            scaffolder. With shame.
            <a href="https://vitejs.dev/" target="_blank" rel="noopener"
                >Vite</a
            >
            +
            <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a
            >.
        </h3>
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}
</style>
