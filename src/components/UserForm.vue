<script setup lang="ts">
import { computed, ref } from "vue";
import FormInput from "./FormInput.vue";
import { validate, required, length } from "../validation";
import { NewUser } from "../users";

defineProps<{
  error?: string;
}>();

const emit = defineEmits<{
  (event: 'submit', payload: NewUser): void
}>();

const username = ref("");
const usernameStatus = computed(() => {
  return validate(username.value, [required, length({ min: 5, max: 10 })]);
});

const password = ref("");
const passwordStatus = computed(() => {
  return validate(password.value, [required, length({ min: 10, max: 40 })]);
});

const isInvalid = computed(() => {
  return !usernameStatus.value.valid || !passwordStatus.value.valid;
});


const handleSubmit = async () => {
  if (isInvalid.value) {
    return;
  }
  
  const newUser: NewUser = {
    username: username.value,
    password: password.value,
  };

  try {
    emit('submit', newUser);
  } catch (e) {}
};
</script>


<template>
  <form class="form" @submit.prevent="handleSubmit">
    <FormInput name="Username" v-model="username" :status="usernameStatus" type="text"/>
    <FormInput name="Password" v-model="password" :status="passwordStatus"  type="password"/>
    <div v-if="error" class="is-danger help mb">
      {{ error }}
    </div>
    <button class="button is-primary" :disabled="isInvalid">Submit</button>
  </form>
</template>

<style scoped>
  .form {
    background: white;
    border-radius: 4px;
    margin-top: 2.5rem;
    padding: 2rem 2.5rem;
  }

  .mb {
    margin-bottom: 1rem;
  }
</style>
