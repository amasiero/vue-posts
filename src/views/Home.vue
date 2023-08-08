<script setup lang="ts">
import Timeline from '../components/Timeline.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <Timeline />
    </template>
    <template #fallback>
      <div class="is-flex is-justify-content-center is-align-items-center">
        <progress class="progress is-small is-primary" />
      </div>
    </template>
  </Suspense>
</template>