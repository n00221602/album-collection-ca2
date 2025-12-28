<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Artist } from "@/types";
import artistService from "@/services/artists";
import { useToast } from "vue-toastification";
import { Spinner } from "@/components/ui/spinner";
import AlbumComponent from "@/components/Album.vue";
import axios from "axios";
import { ArrowLeft } from "lucide-vue-next";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
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
const artist = ref<Artist | null>(null);
const artistImage = ref<string>("");
const isLoading = ref(true);

onMounted(async () => {
  try {
    artist.value = await artistService.getArtist(props.id);
    if (artist.value) {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${artist.value.name}&type=master&token=VdealDdEcIKuzMoTGClVUUykVMMuDKFLDehQNoVW`
      );
      if (response.data.results && response.data.results.length > 0) {
        artistImage.value = response.data.results[0].cover_image;
      }
    }
  } catch (error: unknown) {
    toast.error("Error loading artist.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container bg-slate-800 m-auto max-w-2xl p-8 shadow-2xl rounded-lg">
    <div v-if="isLoading">
      <Spinner class="size-8" />
    </div>
    <div v-else>
      <div class="mb-6">
        <Button variant="ghost" class="flex items-center gap-2" @click="router.back()">
          <ArrowLeft />Back
        </Button>
        <h2>Artist Details</h2>
      </div>
      <Card class="bg-slate-700 border-0 text-white mt-4">
        <CardContent v-if="artist">
          <!-- Artist Image -->
          <div class="relative flex justify-center w-full bg-slate-600 py-3 rounded-lg">
            <img v-if="artistImage" :src="artistImage" :alt="artist.name"
              class=" w-1/2 h-65 bg-slate-700 p-2 shadow-xl" />
          </div>
          <div class="p-3 rounded-lg">
            <!-- Artist Name -->
            <CardHeader class="p-0 my-4">
              <CardTitle class="text-4xl text-center font-bold text-white mb-2">{{ artist?.name }}</CardTitle>
            </CardHeader>

            <!-- Artist Bio -->
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-500">Bio</p>
              <p class="text-lg">{{ artist?.bio }}</p>
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

      <!-- Albums by this Artist -->
      <div v-if="artist && artist.releases && artist.releases.length > 0" class="mt-8">
        <Card class="bg-slate-700 border-0 text-white shadow-2xl rounded-lg p-4">
          <CardHeader class="p-0 my-2">
            <CardTitle class="text-2xl text-center font-bold text-white">Albums by {{ artist.name }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-4">
              <AlbumComponent v-for="album in artist.releases" :key="album.id" :album="album" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
