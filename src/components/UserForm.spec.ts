import { mount } from '@vue/test-utils';
import { Pinia, createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { Router, createMemoryHistory, createRouter } from 'vue-router';

import { routes } from '../router';
import UserForm from './UserForm.vue';

describe('Navbar', () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
  });

  it('runs through the workflow', async () => {
    const wrapper = mount(UserForm, {
      global: {
        plugins: [pinia, router],
      },
    });

    const usernameInput = wrapper.find('[data-test-id="username"]');
    const passwordInput = wrapper.find('[data-test-id="password"]');
    const submitButton = wrapper.find('button');

    expect(usernameInput.find('.is-danger').text()).toBe('This field is required');
    expect(passwordInput.find('.is-danger').text()).toBe('This field is required');
    expect(submitButton.element.disabled).toBe(true);

    await usernameInput.find('input').setValue('test');
    await passwordInput.find('input').setValue('test');

    expect(usernameInput.find('.is-danger').text()).toBe('This field must be between 5 and 10 characters');
    expect(passwordInput.find('.is-danger').text()).toBe('This field must be between 10 and 40 characters');

    await usernameInput.find('input').setValue('username');
    await passwordInput.find('input').setValue('password12345');

    expect(usernameInput.find('.is-danger').exists()).toBe(false);
    expect(passwordInput.find('.is-danger').exists()).toBe(false);
    expect(submitButton.element.disabled).toBe(false);

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted().submit[0]).toEqual([{ username: 'username', password: 'password12345' }]);
  });
});
