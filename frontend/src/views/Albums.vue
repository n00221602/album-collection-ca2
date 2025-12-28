<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Album } from "@/types";
import AlbumComponent from "@/components/Album.vue";
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
import { Columns, Rows } from "lucide-vue-next";
//import AlbumForm from "@/components/AlbumForm.vue";

const toast = useToast();

const hideFavorite = ref(false);
const albums = ref<Album[]>([]);
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

const toggleFavorite = async (album: Album) => {
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
  <div class="container bg-slate-500 m-auto max-w-4xl p-8 shadow-2xl rounded-lg">
    <div v-if="isLoading">
      <Spinner class="size-8" />
    </div>
    <div class="text-center mb-6 mt-2">
      <h1 class="text-3xl font-bold">All Albums</h1>
    </div>
    <div v-if="albums.length < 1">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No albums yet</EmptyTitle>
          <EmptyDescription>You haven't added any albums yet. Get started by adding your first
            album</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
    <div v-else class="grid grid-cols-3 gap-4">
      <AlbumComponent v-for="album in albums" :key="album.id" :album="album" />
    </div>
  </div>
</template>
