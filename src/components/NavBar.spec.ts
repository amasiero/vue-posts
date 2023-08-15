import { mount } from '@vue/test-utils';
import { Pinia, createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Router, createMemoryHistory, createRouter } from 'vue-router';

import { routes } from '../router';
import { useUsers } from '../stores/users';
import Navbar from './Navbar.vue';

// this is needed to mock the fetch function
vi.stubGlobal('fetch', () => {});

describe('Navbar', () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    const el = document.createElement('div');
    el.id = 'modal';
    document.body.appendChild(el);

    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
  });

  it('renders the navbar with sign-in and sign-up buttons when user is not authenticated', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('[data-test-id="sign-up"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="sign-in"]').exists()).toBe(true);
  });

  it('renders the navbar with new post and logout buttons when user is authenticated', async () => {
    const usersStore = useUsers();
    usersStore.currentUserId = '1';

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('[data-test-id="new-post"]').text()).toBe('New Post');
    expect(wrapper.find('[data-test-id="new-post"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="log-out"]').text()).toBe('Log out');
    expect(wrapper.find('[data-test-id="log-out"]').exists()).toBe(true);

    await wrapper.find('[data-test-id="log-out"]').trigger('click');

    expect(wrapper.find('[data-test-id="sign-up"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="sign-in"]').exists()).toBe(true);
  });
});
