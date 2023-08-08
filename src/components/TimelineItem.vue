<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { TimelinePost } from '../posts';

defineProps<{
  post: TimelinePost
}>()
</script>

<template>
  <router-link :to="`/posts/${post.id}`" class="panel-block is-flex is-flex-direction-column is-align-items-flex-start">
    <a>{{ post.title }}</a>
    <div>{{ post.createdAt.toFormat('d MMM') }}</div>
  </router-link>
</template>