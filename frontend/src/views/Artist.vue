<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Artist } from "@/types";
import artistService from "@/services/artists";
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
const artist = ref<Artist | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    artist.value = await artistService.getArtist(props.id);
  } catch (error: unknown) {
    toast.error("Error loading artist.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container m-auto max-w-2xl p-4">
    <div v-if="isLoading">
      <Spinner class="size-8" />
    </div>
    <div v-else>
      <div class="mb-6">
        <Button variant="ghost" class="flex items-center gap-2" @click="router.back()">Back to Album</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Artist Details</CardTitle>
        </CardHeader>
        <CardContent v-if="artist">
          <div class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-500">Name</p>
              <p class="text-lg">{{ artist.name }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500">Bio</p>
              <p class="text-lg">{{ artist.bio }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500">Albums</p>
              <ul class="mt-2 space-y-1">
                <li v-for="album in artist.releases" :key="album.id" class="text-lg">
                  <RouterLink :to="`/albums/${album.id}`">
                    {{ album.title }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardContent v-else>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Artist does not exist</EmptyTitle>
              <EmptyDescription>Please select an artist that exists</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
