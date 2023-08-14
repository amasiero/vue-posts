<script setup lang="ts">
  import highlightjs from 'highlight.js';
  import debounce from 'lodash/debounce';
  import { marked } from 'marked';
  import { onMounted, ref, watch } from 'vue';

  import { Post, TimelinePost } from '../posts';
  import { useUsers } from '../stores/users';

  const props = defineProps<{
    post: TimelinePost | Post;
  }>();

  const emit = defineEmits<{
    (event: 'submit', post: Post): void;
  }>();

  const usersStore = useUsers();

  const title = ref(props.post.title);
  const content = ref(props.post.markdown);
  const html = ref('');
  const contentEditable = ref<HTMLDivElement>();

  const parseHtml = (markdown: string): void => {
    marked.parse(
      markdown,
      {
        gfm: true,
        breaks: true,
        highlight: (code: string) => {
          return highlightjs.highlightAuto(code).value;
        },
      },
      (err: unknown, parseResult: string) => {
        if (err) {
          throw err;
        }
        html.value = parseResult;
      },
    );
  };

  watch(
    content,
    debounce((newContent: string) => {
      parseHtml(newContent);
    }, 250),
    { immediate: true },
  );

  onMounted(() => {
    if (!contentEditable.value) {
      throw new Error('ContentEditable is not defined');
    }
    contentEditable.value.innerText = content.value;
  });

  const handleInput = () => {
    if (!contentEditable.value) {
      throw new Error('ContentEditable is not defined');
    }
    content.value = contentEditable.value.innerText;
  };

  const handleClick = async () => {
    if (!usersStore.currentUserId) {
      throw new Error('User is not logged in');
    }

    const newPost: Post = {
      ...props.post,
      createdAt: typeof props.post.createdAt === 'string' ? props.post.createdAt : props.post.createdAt.toISO(),
      title: title.value,
      authorId: usersStore.currentUserId,
      markdown: content.value,
      html: html.value,
    };
    emit('submit', newPost);
  };
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post title</div>
        <input type="text" class="input" v-model="title" />
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column" style="min-width: 50%">
      <div ref="contentEditable" contenteditable class="editor" @input="handleInput" />
    </div>
    <div class="column" style="max-width: 50%">
      <div v-html="html" />
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <button class="button is-primary is-pulled-right" @click="handleClick">Publish</button>
    </div>
  </div>
</template>

<style scoped>
  .editor {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
    min-height: 300px;
  }
</style>
