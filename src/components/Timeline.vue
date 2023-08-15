<script setup lang="ts">
  import { periods } from '../constants';
  import { usePosts } from '../stores/posts';
  import TimelineItem from './TimelineItem.vue';

  const postStore = usePosts();
  await postStore.fetchPosts();
</script>

<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a
        v-for="period in periods"
        :key="period"
        :class="{ 'is-active': period === postStore.selectedPeriod }"
        @click="postStore.setSelectedPeriod(period)"
      >
        {{ period }}
      </a>
    </span>
    <timeline-item v-for="post in postStore.filteredPosts" :key="post.id" :post="post" />
  </nav>
</template>
