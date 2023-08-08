<script setup lang="ts">
//@ts-ignore
import { DateTime } from 'luxon';
import TimelineItem from './TimelineItem.vue';
import { usePosts } from '../stores/posts';
import { periods } from '../constants';

const postStore = usePosts();
await postStore.fetchPosts();

</script>

<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a 
        v-for="period in periods" 
        :key="period" 
        :class="{'is-active': period === postStore.selectedPeriod}"
        @click="postStore.setSelectedPeriod(period)"
      >
        {{ period }}
      </a>
    </span>
    <timeline-item v-for="post in postStore.filteredPosts" :key="post.id" :post="post" />
  </nav>
</template>