/* eslint-disable no-unused-vars */
import type { FunctionalComponent } from 'vue';
import {
  camelize, defineComponent, getCurrentInstance, h, toHandlerKey,
} from 'vue';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ParseEmits<T extends Record<string, any>> = {
  [K in keyof T]: (...args: T[K]) => void;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Vue doesn't have emits forwarding, in order to bind the emits we have to convert events into `onXXX` handlers
// issue: https://github.com/vuejs/core/issues/5917
export function useEmitAsProps<Name extends string>(
  emit: (name: Name, ...args: any[]) => void,
) {
  const vm = getCurrentInstance();

  const events = vm?.type.emits as Name[];
  const result: Record<string, any> = {};

  events?.forEach((ev) => {
    result[toHandlerKey(camelize(ev))] = (...arg: any) => emit(ev, ...arg);
  });
  return result;
}

export function convertToComponent(component: FunctionalComponent) {
  return defineComponent({
    setup() { return () => h(component); },
  });
}
