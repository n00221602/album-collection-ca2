<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Artist as ArtistType } from "@/types";
import Artist from "@/components/Artist.vue";
import artistService from "@/services/artists";
import { useToast } from "vue-toastification";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
    Empty,
    EmptyTitle,
    EmptyDescription,
    EmptyHeader,
} from "@/components/ui/empty";

const toast = useToast();

const artists = ref<ArtistType[]>([]);
const isLoading = ref(true);

onMounted(async () => {
    try {
        artists.value = await artistService.getAllArtists();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Failed to load artists";
            toast.error(errorMessage);
        }
    } finally {
        isLoading.value = false;
    }
});

const deleteArtist = async (artistToDelete: ArtistType) => {
    try {
        await artistService.deleteArtist(artistToDelete.id);
        artists.value = artists.value.filter((artist) => artist !== artistToDelete);
        toast.success("Artist deleted successfully");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Failed to delete artist";
            toast.error(errorMessage);
        } else {
            const errorMessage = "Failed to delete artist";
            toast.error(errorMessage);
        }
    }
};
</script>

<template>
    <div class="container m-auto max-w-2xl p-4">
        <div v-if="isLoading">
            <Spinner class="size-8" />
        </div>
        <div class="flex justify-between items-center my-6">
            <h2 class="text-2xl font-bold">All Artists</h2>
            <RouterLink to="/admin/artists/form">
                <Button variant="outline">Add Artist</Button>
            </RouterLink>
        </div>
        <div v-if="artists.length < 1" class="text-muted-foreground">
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No artists yet</EmptyTitle>
                    <EmptyDescription>You haven't added any artists yet. Get started by adding your first
                        artist</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
        <ul v-else class="space-y-3">
            <Artist v-for="artist in artists" :key="artist.id" :artist="artist" @delete="deleteArtist(artist)" />
        </ul>
    </div>
</template>
