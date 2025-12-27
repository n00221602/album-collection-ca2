<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Album as AlbumType } from "@/types";
import Album from "@/components/Album.vue";
import albumService from "@/services/albums";
import { useToast } from "vue-toastification";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
//import AlbumForm from "@/components/AlbumForm.vue";

const toast = useToast();

const hideFavorite = ref(false);
const albums = ref<AlbumType[]>([]);
const filteredAlbums = computed(() => {
  return albums.value.filter((album) => !album.favorite || !hideFavorite.value);
});
const isLoading = ref(true);

onMounted(async () => {
  try {
    albums.value = await albumService.getAllAlbums();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to load albums";
      toast.error(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
});

const toggleFavorite = async (album: AlbumType) => {
  try {
    const result = await albumService.updateAlbum(
      album.id,
      album.title,
      album.genre,
      album.year
    );
    album.favorite = result.favorite;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update album";
      toast.error(errorMessage);
    } else {
      const errorMessage = "Failed to update album";
      toast.error(errorMessage);
    }
  }
};
</script>

<template>
  <div class="container m-auto max-w-2xl p-4">
    <div v-if="isLoading"><Spinner class="size-8" /></div>
    <div class="flex justify-between items-center my-6">
      <h2 class="text-2xl font-bold">All Albums</h2>
      <Button variant="outline" @click="hideFavorite = !hideFavorite">
        {{ hideFavorite ? "Show All" : "Hide Favorites" }}
      </Button>
    </div>
    <div v-if="albums.length < 1" class="text-muted-foreground">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No albums yet</EmptyTitle>
          <EmptyDescription
            >You haven't added any albums yet. Get started by adding your first
            album</EmptyDescription
          >
        </EmptyHeader>
      </Empty>
    </div>
    <ul v-else class="space-y-3">
      <Album
        v-for="album in albums"
        :key="album.id"
        :album="album"
      />
    </ul>
  </div>
</template>
