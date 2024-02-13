<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Toaster } from '@/components/ui/toast';
import { toast } from '@/components/ui/toast/use-toast';
import { useMessageStore, useUserStore } from '@/stores';

const userStore = useUserStore();
const messageStore = useMessageStore();
const Links = ref([] as { name: string; path: string }[]);

const { isLogin } = storeToRefs(userStore);

const linkList = ref([
  [
    { name: '產品頁', path: '/dashboard/products' },
    { name: '訂單', path: '/dashboard/orders' },
    { name: '優惠券', path: '/dashboard/coupons' },
  ],
  [
    { name: '回首頁', path: '/' },
    { name: '登入', path: '/dashboard/login' },
  ]]);

function handleChangeLinks(val: boolean) {
  if (val) {
    Links.value = [...linkList.value[0]];
  } else {
    Links.value = [...linkList.value[1]];
  }
}

onMounted(async () => {
  handleChangeLinks(isLogin.value);
  watch(isLogin, (value) => {
    handleChangeLinks(value);
  });
});

const { message, isShow } = storeToRefs(messageStore);

watch(isShow, (newVal) => {
  if (newVal === true) {
    toast({
      title: message.value,
    });
  }
});
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-background">
    <div class="container">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between p-4">
        <div class="flex gap-6 md:gap-8">
          <RouterLink
            to="/"
            class="text-lg font-bold"
          >
            LOGO
          </RouterLink>
        </div>
        <nav class="hidden items-center justify-center gap-6 md:flex">
          <div
            v-for="item in Links"
            :key="(item.name)"
          >
            <RouterLink
              v-if="Links.length > 0"
              :to="item.path"
              class="text-sm font-medium text-muted-foreground transition-colors dark:hover:text-gray-300"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </div>
  </header>
  <div class="min-h-[75vh]">
    <slot />
  </div>
  <footer class="z-40 border-t border-border bg-background text-foreground">
    <div class="container mx-auto flex h-20 max-w-7xl items-center justify-between p-4">
      <div class="flex gap-6 md:gap-8">
        <RouterLink
          to="/"
          class="text-lg font-bold"
        >
          LOGO
        </RouterLink>
      </div>
      <nav class="hidden items-center justify-center gap-6 md:flex">
        <RouterLink
          to="/"
          class="text-sm font-medium text-muted-foreground transition-colors dark:hover:text-gray-300"
        >
          回首頁
        </RouterLink>
      </nav>
    </div>
  </footer>
  <Toaster />
</template>
