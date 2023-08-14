import { DateTime } from 'luxon';
import { defineStore } from 'pinia';

import { Period } from '../constants';
import { Post, TimelinePost } from '../posts';

interface PostState {
  ids: string[];
  all: Map<string, Post>;
  selectedPeriod: Period;
}

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
}

export const usePosts = defineStore('posts', {
  state: (): PostState => ({
    ids: [],
    all: new Map(),
    selectedPeriod: 'Today',
  }),
  actions: {
    setSelectedPeriod(period: Period) {
      this.selectedPeriod = period;
    },
    async fetchPosts() {
      const res = await fetch('/api/posts');
      const data = (await res.json()) as Post[];
      await delay();

      let ids: string[] = [];
      let all: Map<string, Post> = new Map();
      for (const post of data) {
        ids.push(post.id);
        all.set(post.id, post);
      }

      this.ids = ids;
      this.all = all;
    },
    async createPost(post: Post) {
      const body = JSON.stringify(post);
      return fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
    },
    async updatePost(post: Post) {
      const body = JSON.stringify(post);
      return fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
    },
  },
  getters: {
    filteredPosts: (state): TimelinePost[] =>
      state.ids
        .map((id) => {
          const post = state.all.get(id);

          if (!post) {
            throw new Error(`Post ${id} not found`);
          }

          return {
            ...post,
            createdAt: DateTime.fromISO(post.createdAt),
          };
        })
        .filter((post) => {
          switch (state.selectedPeriod) {
            case 'Today':
              return post.createdAt >= DateTime.now().minus({ days: 1 });
            case 'This Week':
              return post.createdAt >= DateTime.now().minus({ weeks: 1 });
            default:
              return post;
          }
        }),
  },
});
