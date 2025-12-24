<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Review } from "@/types";
import reviewService from "@/services/reviews";
import { useToast } from "vue-toastification";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const props = defineProps<{ id: string }>();

const router = useRouter();
const toast = useToast();

const allReviews = ref<Review[]>([]);
//Filters to only show all reviews for the current album
const reviews = computed(() => {
  return allReviews.value.filter((review) => review.albumId === props.id);
});
const isLoading = ref(true);

onMounted(async () => {
  try {
    allReviews.value = await reviewService.getAllReviews();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to load reviews";
      toast.error(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container m-auto max-w-2xl p-4">
    <div v-if="isLoading"><Spinner class="size-8" /></div>
    <div v-else>
      <div class="mb-6">
        <Button variant="ghost" @click="router.back()">
          <ArrowLeft class="mr-2" />Back to Album
        </Button>
      </div>
      <div class="flex justify-between items-center my-6">
        <h2 class="text-2xl font-bold">Album Reviews</h2>
      </div>
      <div v-if="reviews.length < 1" class="text-muted-foreground">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription
              >No reviews have been added for this album yet. Be the first to
              review!</EmptyDescription
            >
          </EmptyHeader>
        </Empty>
      </div>
      <ul v-else class="space-y-3">
        <Card v-for="review in reviews" :key="review.albumId">
          <CardHeader>
            <CardTitle class="text-lg">{{ review.userId.name }}</CardTitle>
          </CardHeader>
          <CardContent v-if="review">
            <div>
              <h1>Rating: {{ review.rating }}/10</h1>
              <p>{{ review.comment }}</p>
              <!-- Add Album image, clicking will lead to that album's details page -->
            </div>
          </CardContent>
        </Card>
      </ul>
    </div>
  </div>
</template>
