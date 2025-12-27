<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { user, isLoggedIn, isLoading } from "@/stores/auth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const router = useRouter();

const isAdmin = computed(() => {
    return isLoggedIn.value && user.value?.role === "admin";
});
</script>

<template>
    <div class="container m-auto max-w-2xl">
        <div v-if="isLoading">
            <Spinner class="size-8" />
        </div>
        <div v-else-if="!isAdmin">
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You need admin privileges to access this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button @click="router.push('/')">Go to Home</Button>
                </CardContent>
            </Card>
        </div>
        <div v-else>
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-center">Admin Dashboard</h1>
                <p class="text-stone-400 text-center">Manage albums, artists, and reviews</p>
            </div>

            <div class="space-y-6">
                <!-- Album CRUD Section -->
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Albums</CardTitle>
                        <CardDescription>Create, edit, or delete albums</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-x-4">
                            <RouterLink :to="`/admin/albums`">
                                <Button>View Albums List</Button>
                            </RouterLink>
                        </div>
                    </CardContent>
                </Card>

                <!-- Artists CRUD Section -->
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Artists</CardTitle>
                        <CardDescription>Create, edit, or delete artists</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-x-4">
                            <RouterLink :to="`/admin/artists`">
                                <Button>View Artists List</Button>
                            </RouterLink>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>
