<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
import { PaginationPrev, type PaginationPrevProps, useForwardProps } from 'radix-vue';
import {
  Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationPrevProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <PaginationPrev v-bind="forwarded">
    <Button
      class="size-10 p-0"
      variant="outline"
    >
      <slot>
        <ChevronLeft class="size-4" />
      </slot>
    </Button>
  </PaginationPrev>
</template>
