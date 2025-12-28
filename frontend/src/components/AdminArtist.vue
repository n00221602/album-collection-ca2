<script setup lang="ts">
import type { Artist } from "@/types/index";
import Button from "@/components/ui/button/Button.vue";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";

const props = defineProps<{ artist: Artist; }>();

const emit = defineEmits<{ delete: [artist: Artist] }>();
</script>

<template>
  <li>
     <Item class="bg-slate-800 border-4 border-black">
      <ItemContent>
        <div>
          <p class="font-semibold">{{ artist.name }}</p>
          <p class="text-sm text-gray-500">Albums: {{ artist.releases.length }}</p>
        </div>
      </ItemContent>
      <ItemActions>
        <RouterLink :to="`/admin/artists/form/${artist.id}`">
        <Button class="bg-orange-600 text-white" data-testid="edit-artist-button">
          Edit
        </Button>
        </RouterLink>
        <Button class="bg-red-600 text-white" @click="emit('delete', artist)" data-testid="delete-artist-button">
          Delete
        </Button>
      </ItemActions>
    </Item>
  </li>
</template>
