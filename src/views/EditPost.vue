<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';

  import PostWriter from '../components/PostWriter.vue';
  import { Post } from '../posts';
  import { usePosts } from '../stores/posts';

  const route = useRoute();
  const router = useRouter();
  const postsStore = usePosts();

  const id = route.params.id as string;
  const post = postsStore.all.get(id);

  if (!post) {
    throw Error(`Post with id ${id} not found`);
  }

  const handleSubmit = async (post: Post) => {
    await postsStore.updatePost(post);
    router.push('/');
  };
</script>

<template>
  Edit Post
  <PostWriter :post="post" @submit="handleSubmit" />
</template>
