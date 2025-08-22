<script setup lang="ts">
</script>

<template>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <div>
      <RouterLink to="/">Go to Home</RouterLink>
    </div>
    <div>
      <RouterLink to="/bai-1">Go to Bai 1</RouterLink>
    </div>
    <div>
      <RouterLink to="/bai-2">Go to Bai 2</RouterLink>
    </div>
    <div>
      <RouterLink to="/bai-3">Go to Bai 3</RouterLink>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
