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
import { ArrowLeft, Star } from "lucide-vue-next";
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
  <div class="container bg-slate-800 m-auto max-w-4xl p-8 shadow-2xl rounded-lg">
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
        <Card v-if="yourReview" class="py-4 text-white bg-slate-700 border-4 border-black">
          <CardHeader class="flex items-center justify-between mb-4">
            <CardTitle class="text-lg">Your Review</CardTitle>
            <CardTitle class="text-lg flex items-center gap-2">{{ yourReview.rating }} / 10
              <Star class="w-6 h-6 fill-yellow-400 text-yellow-500" />
              <RouterLink :to="`/reviews/form/${props.id}/${yourReview.id}`">
                <Button class="bg-orange-500">Edit</Button>
              </RouterLink>
            </CardTitle>
          </CardHeader>
          <CardContent v-if="yourReview">
            <div class="space-y-2">
              <p>{{ yourReview.comment }}</p>
            </div>
          </CardContent>
        </Card>

        <ul class="space-y-2">
          <ReviewComponent v-for="review in reviews.filter(review => review.userId.id !== user?.id)" :key="review.id"
            :review="review" />
        </ul>
      </ul>
    </div>
  </div>
</template>
