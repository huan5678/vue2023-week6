<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { PaginationNext, type PaginationNextProps, useForwardProps } from 'radix-vue';
import {
  Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationNextProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <PaginationNext v-bind="forwarded">
    <Button
      class="size-10 p-0"
      variant="outline"
    >
      <slot>
        <ChevronRight class="size-4" />
      </slot>
    </Button>
  </PaginationNext>
</template>
