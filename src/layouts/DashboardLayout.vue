<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore, useMessageStore } from '@/stores';
import { toast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast/index.ts';

const userStore = useUserStore();
const messageStore = useMessageStore();
const Links = ref([] as { name: string; path: string }[]);

const { isLogin } = storeToRefs(userStore);

function handleChangeLinks(val: boolean)
{
  console.log(val);
  if (val) {
    Links.value = [ ...linkList.value[ 0 ] ];
  }
  else {
    Links.value = [ ...linkList.value[ 1 ] ];
  }
}

onMounted(async () =>
{
  handleChangeLinks(isLogin.value);
  watch(isLogin, (value) =>
  {
    handleChangeLinks(value)
  });
})

const linkList = ref([
  [
    { name: '產品頁', path: '/dashboard/products' },
    { name: '訂單', path: '/dashboard/orders' },
    { name: '優惠券', path: '/dashboard/coupons' },
  ],
  [
    { name: '回首頁', path: '/' },
    { name: '登入', path: '/dashboard/login' },
  ] ]);

const { message, isShow } = storeToRefs(messageStore);

watch(isShow, (newVal) =>
{
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
      <div class="flex items-center justify-between h-20 p-4 mx-auto max-w-8xl">
        <div class="flex gap-6 md:gap-8">
          <RouterLink to="/" class="font-bold text-md"> LOGO </RouterLink>
        </div>
        <nav class="items-center justify-center hidden gap-6 md:flex">
          <RouterLink v-if="Links.length > 0" v-for="item in Links" :key="(item.name)" :to="item.path"
                      class="text-sm font-medium transition-colors text-muted-foreground dark:hover:text-gray-300">
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
  <div class="min-h-[75vh]">
    <slot />
  </div>
  <footer class="z-40 border-t border-border bg-background text-foreground">
    <div class="container flex items-center justify-between h-20 p-4 mx-auto max-w-8xl">
      <div class="flex gap-6 md:gap-8">
        <RouterLink to="/" class="font-bold text-md"> LOGO </RouterLink>
      </div>
      <nav class="items-center justify-center hidden gap-6 md:flex">
        <RouterLink to="/"
                    class="text-sm font-medium transition-colors text-muted-foreground dark:hover:text-gray-300">
          回首頁
        </RouterLink>
      </nav>
    </div>
  </footer>
  <Toaster />
</template>
