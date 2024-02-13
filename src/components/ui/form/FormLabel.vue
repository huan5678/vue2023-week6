<script lang="ts" setup>
import { useAttrs } from 'vue';
import { Label } from 'radix-vue';
import { cn } from '@/lib/utils';
import { useFormField } from './useFormField';

defineOptions({
  inheritAttrs: false,
});

const { error, formItemId } = useFormField();
const { class: className, ...rest } = useAttrs();
</script>

<template>
  <Label
    :class="cn(
      'block text-sm tracking-tight font-medium text-foreground text-left',
      error && 'text-destructive',
      className ?? '',
    )"
    :for="formItemId"
    v-bind="rest"
  >
    <slot />
  </Label>
</template>
