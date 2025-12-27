<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import type { Review } from "@/types";
import { user } from "@/stores/auth";
import reviewService from "@/services/reviews";
import { useToast } from "vue-toastification";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";
import ReviewComponent from "@/components/Review.vue";
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


//Finds if the current user has a review for this album
const yourReview = computed(() => {
  return allReviews.value.find(
    (review) => review.albumId === props.id && user.value && review.userId.id === user.value.id);
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
    <div v-if="isLoading">
      <Spinner class="size-8" />
    </div>
    <div v-else>
      <div class="mb-6">
        <Button variant="ghost" @click="router.back()">
          <ArrowLeft class="mr-2" />Back to Album
        </Button>
      </div>
      <div class="flex justify-between items-center space-x-4 my-6">
        <h2 class="text-2xl font-bold">Album Reviews</h2>
        <div v-if="!yourReview">
          <RouterLink :to="`/reviews/form/${props.id}`">
            <Button class="bg-blue-500">Add Your Review</Button>
          </RouterLink>
        </div>
      </div>
      <div v-if="reviews.length < 1" class="text-muted-foreground">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>No reviews have been added for this album yet. Be the first to
              review!</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
      <ul v-else class="space-y-3">
        <Card v-if="yourReview" class="py-4">
          <CardHeader>
            <!-- If a user exists and a review was made by them, show "Your Review" -->
            <div class="flex justify-between items-center">
              <CardTitle class="text-lg">Your Review</CardTitle>
              <RouterLink :to="`/reviews/form/${props.id}/${yourReview.id}`">
                <Button class="bg-orange-500">Edit Your Review</Button>
              </RouterLink>
            </div>
          </CardHeader>
          <CardContent v-if="yourReview">
            <div>
              <h1>Rating: {{ yourReview.rating }}/10</h1>
              <p>{{ yourReview.comment }}</p>
              <!-- Add Album image, clicking will lead to that album's details page -->
            </div>
          </CardContent>
        </Card>

        <ul class="py-4">
          <ReviewComponent v-for="review in reviews.filter(review => review.userId.id !== user?.id)" :key="review.id" :review="review" />
        </ul>
      </ul>
    </div>
  </div>
</template>
