<script setup lang="ts">
import { ChevronsLeft } from 'lucide-vue-next';
import { PaginationFirst, type PaginationFirstProps, useForwardProps } from 'radix-vue';
import {
  Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationFirstProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <PaginationFirst v-bind="forwarded">
    <Button
      class="size-10 p-0"
      variant="outline"
    >
      <slot>
        <ChevronsLeft class="size-4" />
      </slot>
    </Button>
  </PaginationFirst>
</template>
