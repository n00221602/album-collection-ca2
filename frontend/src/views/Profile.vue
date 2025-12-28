<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn, user, isLoading, logout } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "vue-toastification";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Review, Album } from "@/types";
import reviewService from "@/services/reviews";
import albumService from "@/services/albums";
import axios from "axios";
import ReviewComponent from "@/components/Review.vue";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";

const router = useRouter();
const toast = useToast();

const userReviews = ref<Review[]>([]);
const reviewsLoading = ref(true);
const albums = ref<Album[]>([]);

const albumMap = computed(() => {
  const map = new Map<string, string>();
  albums.value.forEach(album => {
    map.set(album.id, album.title);
  });
  return map;
});

const handleLogout = async () => {
  try {
    await logout();
    toast.success("Successfully logged out!");
    router.push("/login");
  } catch (error: unknown) {
    toast.error("An error occurred while logging out. Please try again.");
  }
};

onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      userReviews.value = await reviewService.getUserReviews();
      albums.value = await albumService.getAllAlbums();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to load reviews";
        toast.error(errorMessage);
      }
    } finally {
      reviewsLoading.value = false;
    }
  }
});
</script>

<template>
  <div class="container bg-slate-600 m-auto max-w-4xl p-8 shadow-2xl rounded-lg">
    <div v-if="isLoggedIn && user">
      <Card class="mt-6 border-4 border-black bg-slate-800 text-white">
        <CardHeader>
          <CardTitle class="text-2xl">Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <p class="text-muted-foreground">Email</p>
            <p>{{ user.email }}</p>
          </div>
          <Button variant="destructive" @click="handleLogout">Logout</Button>
        </CardContent>
      </Card>

      <Card class="mt-6 border-4 border-black bg-slate-800 text-white">
        <CardHeader>
          <CardTitle class="text-2xl">Your Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="reviewsLoading">
            <Spinner class="size-8" />
          </div>
          <div v-else-if="userReviews.length < 1" class="text-muted-foreground">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>You haven't reviewed any albums yet.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
          <ul v-else class="space-y-3">
            <ReviewComponent v-for="review in userReviews" :key="review.id" :review="review"
              :album-title="albumMap.get(review.albumId)" />
          </ul>
        </CardContent>
      </Card>
    </div>
    <div v-else-if="isLoading">
      <p>
        <Spinner />
      </p>
    </div>
    <div v-else>
      <p>Not logged in</p>
    </div>
  </div>
</template>
