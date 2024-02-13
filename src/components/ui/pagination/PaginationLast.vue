<script setup lang="ts">
import { ChevronsRight } from 'lucide-vue-next';
import { PaginationLast, type PaginationLastProps, useForwardProps } from 'radix-vue';
import {
  Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationLastProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <PaginationLast v-bind="forwarded">
    <Button
      class="size-10 p-0"
      variant="outline"
    >
      <slot>
        <ChevronsRight class="size-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
