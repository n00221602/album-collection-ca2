<script setup lang="ts">
import type { Album } from "@/types/index";
import { RouterLink } from "vue-router";
import { Card, CardContent, CardAction } from "@/components/ui/card";
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{ album: Album; }>();

const albumImage = ref<string>("");

onMounted(async () => {
  try {
    const response = await axios.get(
      `https://api.discogs.com/database/search?q=${props.album.title}&type=master&token=VdealDdEcIKuzMoTGClVUUykVMMuDKFLDehQNoVW`
    );
    if (response.data.results && response.data.results.length > 0) {
      albumImage.value = response.data.results[0].cover_image;
    }
  } catch (error) {
    console.error("Failed to fetch album image:", error);
  }
});
</script>

<template>
  <RouterLink :to="`albums/${props.album.id}`">
    <Card class="relative p-0 border-2 border-black">
      <img v-if="albumImage" :src="albumImage" :alt="props.album.title" class="p-0 rounded-lg" />
      <div
        class="absolute inset-0 bg-black opacity-0 hover:opacity-80 transition-opacity rounded-lg border-2 border-stone-800 flex items-center justify-center">
        <p class="font-semibold text-white text-lg text-center px-4">{{ props.album.title }}</p>
      </div>
    </Card>
  </RouterLink>

</template>
