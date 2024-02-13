<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { userLogin } = userStore;
const { isLogin } = storeToRefs(userStore);

const router = useRouter();
const isLoading = ref(false);
const userData = ref({ username: '', password: '' });

const handleLoginSubmit = async () =>
{
  try {
    isLoading.value = true;
    const success = await userLogin(
      userData.value.username,
      userData.value.password
    );
    isLogin.value = true;
    isLoading.value = false;
    if (success) router.push('/dashboard/products');
  } catch (error) {
    console.dir(error);
    isLoading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleLoginSubmit()" class="grid gap-4 p-4 mx-auto md:max-w-screen-md">
    <div class="space-y-6">
      <h2 class="text-2xl text-center">使用者登入</h2>
      <div>
        <Label for="username" class="text-gray-700"> 使用者名稱 </Label>
        <Input type="text" id="username" v-model="userData.username"
               class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               placeholder="" :disabled="isLoading" />
      </div>
      <div>
        <Label for="password" class="text-gray-700"> 密碼 </Label>
        <Input type="password" id="password" v-model="userData.password"
               class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               :disabled="isLoading" />
      </div>
      <div>
        <Button type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:bg-gray-500"
                :disabled="isLoading">登入</Button>
      </div>
    </div>
  </form>
</template>
