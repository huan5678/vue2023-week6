<script setup lang="ts">
import { watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { NavBar } from '@/components';
import { Toaster } from '@/components/ui/toast';
import { useToast } from '@/components/ui/toast/use-toast';
import { useMessageStore } from '@/stores';

const messageStore = useMessageStore();
const { toast } = useToast();
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
  <div class="flex min-h-screen flex-col bg-background">
    <header class="sticky top-0 z-40 border-b border-border bg-background">
      <div class="container">
        <NavBar />
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="z-40 border-t border-border bg-background text-foreground">
      <div
        class="container mx-auto flex h-20 max-w-7xl items-center justify-between p-4"
      >
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
            to="/dashboard"
            class="text-sm font-medium text-muted-foreground transition-colors dark:hover:text-gray-300"
          >
            後台
          </RouterLink>
        </nav>
      </div>
    </footer>
  </div>
  <Toaster />
</template>
