<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Album } from "@/types";
import albumService from "@/services/albums";
import { useToast } from "vue-toastification";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Trash2, Star, ArrowLeft } from "lucide-vue-next";
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
const isLoading = ref(true);

onMounted(async () => {
  try {
    album.value = await albumService.getAlbum(props.id);
    if (album.value) {
      // artist.value = await artistService.getArtist(album.value.artist.id);
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

const deleteAlbum = async () => {
  try {
    await albumService.deleteAlbum(props.id);
    router.push("/");
  } catch (error: unknown) {
    toast.error("Failed to delete album.");
  }
};
</script>

<template>
  <div class="container m-auto max-w-2xl p-4">
    <div v-if="isLoading"><Spinner class="size-8" /></div>
    <div v-else>
      <div class="mb-6">
        <Button variant="ghost">
          <RouterLink to="/" class="flex items-center gap-2"
            ><ArrowLeft />Back to Albums</RouterLink
          >
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Album Details</CardTitle>
          <CardAction>
            <Button variant="ghost" :disabled="!album" @click="toggleFavorite">
              <Star
                :class="
                  album?.favorite
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                "
              />
            </Button>
            <Button variant="ghost" :disabled="!album" @click="deleteAlbum"
              ><Trash2
            /></Button>
          </CardAction>
        </CardHeader>
        <CardContent v-if="album">
          <div class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-500">Title</p>
              <p class="text-lg">{{ album.title }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500">Artist</p>
              <p class="text-lg">{{ album.artist.name }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500">Genre</p>
              <p class="text-lg">{{ album.genre.join(", ") }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500">Year</p>
              <p class="text-lg">{{ album.year }}</p>
            </div>
          </div>
        </CardContent>
        <CardContent v-else>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Album does not exist</EmptyTitle>
              <EmptyDescription
                >Please select an album that exists</EmptyDescription
              >
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
