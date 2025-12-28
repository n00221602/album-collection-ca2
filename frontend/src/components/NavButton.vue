<script setup lang="ts">
import { Button } from "@/components/ui/button";
const props = defineProps<{
  to: string;
}>();
</script>

<template>
  <RouterLink :to="props.to" v-slot="{ navigate, isActive }">
    <Button class="bg-slate-500 mr-2" :class="{ 'bg-accent': isActive, 'text-black': isActive }" @click="navigate">
      <slot></slot>
    </Button>
  </RouterLink>
</template>
