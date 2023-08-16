import { mount } from '@vue/test-utils';
import { Pinia, createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { Router, createMemoryHistory, createRouter } from 'vue-router';

import { routes } from '../router';
import { useUsers } from '../stores/users';
import PostWriter from './PostWriter.vue';

describe('PostWriter', () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    const users = useUsers();
    users.currentUserId = '1';

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
  });

  it('writes a post using markdown', () => {
    return new Promise<void>(async (resolve) => {
      const wrapper = mount(PostWriter, {
        props: {
          post: {
            id: '1',
            title: '',
            authorId: '1',
            createdAt: '',
            markdown: '',
            html: '',
          },
        },
        global: {
          plugins: [pinia, router],
        },
      });

      wrapper.find<HTMLDivElement>('.editor').element.innerText = '# Title';
      await wrapper.find('.editor').trigger('input');

      setTimeout(async () => {
        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted().submit[0]).toMatchInlineSnapshot(`
          [
            {
              "authorId": "1",
              "createdAt": "",
              "html": "<h1 id=\\"title\\">Title</h1>
          ",
              "id": "1",
              "markdown": "# Title",
              "title": "",
            },
          ]
        `);
        resolve();
      }, 300);
    });
  });
});
