import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { computed, defineComponent, ref } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { routes } from '../router';
import { useUsers } from '../stores/users';
import Navbar from './Navbar.vue';

describe('Navbar', () => {
  it('renders the navbar with sign-in and sign-up buttons when user is not authenticated', () => {
    const el = document.createElement('div');
    el.id = 'modal';
    document.body.appendChild(el);

    const pinia = createPinia();
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('[data-test-id="sign-up"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="sign-in"]').exists()).toBe(true);
  });

  it('renders the navbar with new post and logout buttons when user is authenticated', async () => {
    const el = document.createElement('div');
    el.id = 'modal';
    document.body.appendChild(el);

    const pinia = createPinia();
    setActivePinia(pinia);

    const usersStore = useUsers();
    usersStore.currentUserId = '1';

    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('[data-test-id="new-post"]').text()).toBe('New Post');
    expect(wrapper.find('[data-test-id="new-post"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="log-out"]').text()).toBe('Log out');
    expect(wrapper.find('[data-test-id="log-out"]').exists()).toBe(true);
  });
});
