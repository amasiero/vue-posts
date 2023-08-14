<script setup lang="ts">
  import { DateTime } from 'luxon';
  import { useRouter } from 'vue-router';

  import PostWriter from '../components/PostWriter.vue';
  import { Post, TimelinePost } from '../posts';
  import { usePosts } from '../stores/posts';
  import { useUsers } from '../stores/users';

  const usersStore = useUsers();
  const postsStore = usePosts();
  const router = useRouter();

  if (!usersStore.currentUserId) {
    throw new Error('User is not logged in');
  }

  const post: TimelinePost = {
    id: '-1',
    title: 'Title',
    authorId: usersStore.currentUserId,
    createdAt: DateTime.now(),
    markdown: '## Title',
    html: '<h2>Title</h2>',
  };

  const handleSubmit = async (post: Post) => {
    await postsStore.createPost(post);
    router.push('/');
  };
</script>

<template>
  New Post
  <PostWriter :post="post" @submit="handleSubmit" />
</template>
