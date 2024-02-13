<script lang="ts" setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { handleCheck } from '@/api';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useMessageStore, useUserStore } from '@/stores';
import { SimpleResponse } from '@/types';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);
const { showMessage } = useMessageStore();
const router = useRouter();

onMounted(async () => {
  try {
    if (!isLogin.value) {
      const token = Cookies.get('token') || '';
      const res = await handleCheck(token);
      if (res.success) {
        isLogin.value = true;
        showMessage('登入成功');
      }
    }
  } catch (error: unknown) {
    if ((error as AxiosError<SimpleResponse>).response?.data.success === false) {
      router.push('/dashboard/login');
    }
  }
});
</script>

<template>
  <DashboardLayout>
    <RouterView />
  </DashboardLayout>
</template>
