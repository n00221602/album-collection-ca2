<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Album } from "@/types";
import AdminAlbum from "@/components/AdminAlbum.vue";
import albumService from "@/services/albums";
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

const hideFavorite = ref(false);
const albums = ref<Album[]>([]);
const isLoading = ref(true);

onMounted(async () => {
    try {
        albums.value = await albumService.getAllAlbums();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Failed to load albums";
            toast.error(errorMessage);
        }
    } finally {
        isLoading.value = false;
    }
});

const deleteAlbum = async (chosenAlbum: Album) => {
    try {
        await albumService.deleteAlbum(chosenAlbum.id!);
        //Refresh the artists list after deleting
        albums.value = albums.value.filter(album => album.id !== chosenAlbum.id);
        toast.success("Album deleted successfully!");
    } catch (error: unknown) {
        toast.error("Failed to delete album.");
    }
};
</script>

<template>
    <div class="container m-auto bg-slate-700 border-4 border-black rounded-lg max-w-2xl p-4">
        <div v-if="isLoading">
            <Spinner class="size-8" />
        </div>
        <div class="flex justify-between items-center my-6">
            <h2 class="text-2xl font-bold">All Albums</h2>
            <RouterLink to="/admin/albums/form">
                <Button class="bg-indigo-800">Add Album</Button>
            </RouterLink>
        </div>
        <div v-if="albums.length < 1" class="text-muted-foreground">
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No albums yet</EmptyTitle>
                    <EmptyDescription>You haven't added any albums yet. Get started by adding your first
                        album</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
        <ul v-else class="space-y-3">
            <AdminAlbum v-for="album in albums" :key="album.id" :album="album" @delete="deleteAlbum(album)" />
        </ul>
    </div>
</template>
