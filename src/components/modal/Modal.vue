<template>
    <div class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <slot></slot>
        <div :class="style"></div>
    </div>
</template>
<script setup>
// Props
defineProps({
    style: {
        type: String,
        default: "w-screen h-screen bg-black absolute top-0 left-0 opacity-20 z-20",
    }
});
</script>