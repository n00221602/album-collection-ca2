<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Album } from "@/types";
import albumService from "@/services/albums";
import { useToast } from "vue-toastification";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

const props = defineProps<{ id: string }>();

const router = useRouter();
const toast = useToast();
const album = ref<Album | null>(null);
const albumImage = ref<string>("");
const isLoading = ref(true);

onMounted(async () => {
  try {
    album.value = await albumService.getAlbum(props.id);
    if (album.value) {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${album.value.title}&type=master&token=VdealDdEcIKuzMoTGClVUUykVMMuDKFLDehQNoVW`
      );
      if (response.data.results && response.data.results.length > 0) {
        albumImage.value = response.data.results[0].cover_image;
      }
    }
  } catch (error: unknown) {
    toast.error("Error loading album.");
  } finally {
    isLoading.value = false;
  }
});

const toggleFavorite = async () => {
  if (!album.value) return;
  const { id, title, genre, year } = album.value;
  try {
    await albumService.updateAlbum(id, title, genre, year);
    album.value.favorite = !album.value.favorite;
  } catch (error: unknown) {
    toast.error("Failed to update album favorite.");
  }
};
</script>

<template>
  <div class="container bg-slate-800 m-auto max-w-4xl p-8 shadow-2xl rounded-lg text-white">
    <div v-if="isLoading">
      <Spinner class="size-8" />
    </div>
    <div v-else>
      <Button variant="ghost">
        <RouterLink to="/" class="flex items-center gap-2">
          <ArrowLeft />Back to Albums
        </RouterLink>
      </Button>
    </div>
    <Card class="bg-slate-700 border-0 text-white mt-4">
      <CardContent v-if="album">
        <div class="grid grid-cols-2 gap-4">
          <!-- Album Column 1 -->
          <div class="flex flex-col justify-between">
            <!-- Album Title -->
            <CardHeader class="p-0 my-4">
              <CardTitle class="text-4xl text-center font-bold text-white mb-2">{{ album?.title }}</CardTitle>
            </CardHeader>

            <!-- Album Artist -->
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-500">Artist</p>
              <RouterLink :to="`/artists/${album.artist.id}`">
                <p class="text-lg">{{ album.artist.name }}</p>
              </RouterLink>
            </div>

            <!-- Album Genre -->
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-500">Genre</p>
              <p class="text-lg">{{ album.genre.join(", ") }}</p>
            </div>

            <!-- Album Year -->
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-500">Year</p>
              <p class="text-lg">{{ album.year }}</p>
            </div>

            <!-- View Reviews Button -->
            <div class=" pt-4">
                <RouterLink :to="`/reviews/${album.id}`">
                  <Button class="w-full">Show All Reviews</Button>
                </RouterLink>
            </div>
          </div>

          <!-- Album Column 2 -->
          <div class="flex items-center justify-center bg-slate-600 p-2 shadow-xl">
            <!-- Album Cover Image -->
            <img v-if="albumImage" :src="albumImage" :alt="album.title" class=" w-full object-cover" />
          </div>


        </div>
      </CardContent>
      <CardContent v-else>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Album does not exist</EmptyTitle>
            <EmptyDescription>Please select an album that exists</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  </div>
</template>
