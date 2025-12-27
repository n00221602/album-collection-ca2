<script setup lang="ts">
import type { Album } from "@/types/index";
import Button from "@/components/ui/button/Button.vue";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";

const props = defineProps<{ album: Album; }>();
const emit = defineEmits<{ delete: [album: Album] }>();
</script>

<template>
  <li>
    <Item variant="outline">
      <ItemContent>
        <RouterLink :to="`albums/${props.album.id}`">
          <div>
            <p class="font-semibold">{{ props.album.title }}</p>
            <p class="text-sm text-gray-500">
              {{ props.album.genre.join(", ") }} • {{ props.album.year }}
            </p>
          </div>
        </RouterLink>
      </ItemContent>
      <ItemActions>
        <RouterLink :to="`/admin/albums/form/${album.id}`">
        <Button class="bg-orange-600 text-white" data-testid="edit-album-button">
          Edit
        </Button>
        </RouterLink>
        <Button class="bg-red-600 text-white" @click="emit('delete', album)" data-testid="delete-album-button">
          Delete
        </Button>
      </ItemActions>
    </Item>
  </li>
</template>
