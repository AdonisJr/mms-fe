<template>
    <div class="flex items-center justify-center h-screen w-screen absolute top-0 left-0 z-50">
        <div class="absolute w-full h-full bg-black opacity-20"></div>
        <div class="relative flex items-center justify-center space-x-2">
            <div class="dot animate-pulse"></div>
            <div class="dot animate-pulse animation-delay-200"></div>
            <div class="dot animate-pulse animation-delay-400"></div>
        </div>
    </div>
</template>

<script setup>
// No additional logic is needed for the loading animation
</script>

<style scoped>
.dot {
    width: 12px;
    height: 12px;
    background-color: black;
    border-radius: 50%;
}

.animate-pulse {
    animation: pulse 1s infinite;
}

.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0% {
        opacity: 0.25;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
    }
}
</style>
