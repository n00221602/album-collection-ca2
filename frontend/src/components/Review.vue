<script setup lang="ts">
import type { Review } from "@/types/index";
import { RouterLink } from "vue-router";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Star } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import axios from "axios";

// The albumTitle prop is optional, used to display content for the Profile view
const props = defineProps<{ review: Review; albumTitle?: string }>();

const emit = defineEmits<{ delete: [review: Review] }>();

const albumImage = ref<string>("");

onMounted(async () => {
  if (props.albumTitle) {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${props.albumTitle}&type=master&token=VdealDdEcIKuzMoTGClVUUykVMMuDKFLDehQNoVW`
      );
      if (response.data.results && response.data.results.length > 0) {
        albumImage.value = response.data.results[0].cover_image;
      }
    } catch (error) {
      console.error("Failed to fetch album image:", error);
    }
  }
});</script>

<template>
  <Card class="py-4 text-white bg-slate-700 border-4 border-black">
    <CardHeader class="flex items-center justify-between mb-4">
      <CardTitle v-if="albumTitle" class="font-semibold">{{ albumTitle }}</CardTitle>
      <CardTitle class="text-lg">{{ review.userId.name }}</CardTitle>
      <CardTitle class="text-lg flex items-center gap-2">{{ review.rating }} / 10
        <Star class="w-6 h-6 fill-yellow-400 text-yellow-500" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <p>{{ review.comment }}</p>
        </div>

        <div class="flex flex-col items-end space-y-2">
          <div v-if="albumImage">
            <RouterLink :to="`/albums/${review.albumId}`">
              <img :src="albumImage" :alt="albumTitle || 'Album cover'"
                class="w-20 h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow" />
            </RouterLink>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
