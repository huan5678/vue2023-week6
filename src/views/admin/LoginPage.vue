<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/zod';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMessageStore, useUserStore } from '@/stores';

const userStore = useUserStore();

const { userLogin } = userStore;
const { isLogin } = storeToRefs(userStore);

const { showMessage } = useMessageStore();

const router = useRouter();
const isLoading = ref(false);
const userData = ref({ username: '', password: '' });

const formSchema = toTypedSchema(z.object({
  username: z.string().email('請輸入正確的Email格式'),
  password: z.string().min(6, '最少請輸入六個字'),
}));

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
  initialValues: userData.value,
});

const handleLoginSubmit = handleSubmit(async (value) => {
  try {
    isLoading.value = true;
    const success = await userLogin(
      value.username,
      value.password,
    );
    isLogin.value = true;
    isLoading.value = false;
    if (success) router.push('/dashboard/products');
  } catch (error: unknown) {
    showMessage((error as Error).message);
    isLoading.value = false;
  }
});
</script>

<template>
  <form
    class="mx-auto grid gap-4 p-4 md:max-w-screen-md"
    @submit="handleLoginSubmit"
  >
    <div class="space-y-6">
      <h2 class="text-center text-2xl">
        使用者登入
      </h2>
      <FormField
        v-slot="{ componentField }"
        name="username"
      >
        <FormItem>
          <FormLabel>使用者名稱</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder=""
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="password"
      >
        <FormItem>
          <FormLabel>密碼</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder=""
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button
        type="submit"
        class="flex w-full justify-center rounded-md bg-indigo-600
          px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
          hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-indigo-600
          disabled:bg-gray-500 disabled:opacity-50"
        :disabled="!meta.valid"
      >
        登入
      </Button>
    </div>
  </form>
</template>
