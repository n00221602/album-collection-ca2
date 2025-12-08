<script setup lang="ts">
import type { Album } from "@/types/index";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
import { Star, Trash2 } from "lucide-vue-next";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";

defineProps<{
  album: Album;
}>();

const emit = defineEmits<{
  delete: [album: Album];
  "toggle-favorite": [];
}>();
</script>

<template>
  <li>
    <Item variant="outline">
      <ItemContent>
        <RouterLink :to="`albums/${album.id}`">
          <div>
            <p class="font-semibold">{{ album.title }}</p>
            <p class="text-sm text-gray-500">
              {{ album.genre.join(", ") }} • {{ album.year }}
            </p>
          </div>
        </RouterLink>
      </ItemContent>
      <ItemActions>
        <!-- <Button
          variant="ghost"
          class="action-button"
          data-testid="toggle-favorite-button"
          @click="emit('toggle-favorite')"
        >
          <Star
            :class="
              album.favorite
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-400'
            "
          />
        </Button>
        <Button
          variant="ghost"
          @click="emit('delete', album)"
          data-testid="delete-album-button"
        >
          <Trash2 class="text-red-400" />
        </Button> -->
      </ItemActions>
    </Item>
  </li>
</template>
