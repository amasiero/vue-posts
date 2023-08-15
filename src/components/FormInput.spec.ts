import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FormInput from './FormInput.vue';

describe('FormInput', () => {
  it('render some errors', () => {
    const wrapper = mount(FormInput, {
      propsData: {
        name: 'foo',
        modelValue: 'bar',
        status: {
          valid: false,
          message: 'error',
        },
        type: 'text',
      },
    });
    console.log(wrapper.html());
    expect(wrapper.find('.is-danger')).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = mount(FormInput, {
      props: {
        name: 'foo',
        modelValue: 'bar',
        status: {
          valid: true,
          message: 'error',
        },
        type: 'text',
      },
    });
    console.log(wrapper.html());
    expect(wrapper.find('.is-danger')).toBeFalsy();
  });
});
