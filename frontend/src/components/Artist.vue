<script setup lang="ts">
import type { Artist } from "@/types/index";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";

defineProps<{
  artist: Artist;
}>();

const emit = defineEmits<{
  delete: [artist: Artist];
}>();
</script>

<template>
  <li>
    <Item variant="outline">
      <ItemContent>
          <div>
            <p class="font-semibold">{{ artist.name }}</p>
            <p class="text-sm text-gray-500">Albums: {{ artist.releases.length }}</p>
          </div>
      </ItemContent>
      <ItemActions>
        <Button class="bg-red-600 text-white" @click="emit('delete', artist)" data-testid="delete-artist-button">
          Delete
        </Button>
      </ItemActions>
    </Item>
  </li>
</template>
