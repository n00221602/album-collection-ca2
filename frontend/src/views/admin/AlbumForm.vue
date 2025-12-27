<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { albumSchema } from "@/schemas/album";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field, FieldArray } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AlbumInput } from "@/schemas/album";
import type { Artist, Album } from "@/types";
import albumService from "@/services/albums";
import artistService from "@/services/artists";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const artists = ref<Artist[]>([]);
const currentAlbum = ref<Album | null>(null);

const emit = defineEmits<{ submit: [album: AlbumInput] }>();

const props = defineProps<{ id?: string; albumId?: string }>();

const validationSchema = toTypedSchema(albumSchema);
const { handleSubmit, isSubmitting, errors, setValues } = useForm({
    validationSchema,
    initialValues: {
        title: "",
        genre: [""],
        year: 2025,
        artistId: props.id || "",
    },
});

onMounted(async () => {
    try {
        artists.value = await artistService.getAllArtists();

        // If albumId exists, fetch the album data for editing
        if (props.albumId) {
            currentAlbum.value = await albumService.getAlbum(props.albumId);
            setValues({
                title: currentAlbum.value.title,
                genre: currentAlbum.value.genre,
                year: currentAlbum.value.year,
                artistId: currentAlbum.value.artist.id,
            });
        }
    } catch (error: any) {
        toast.error(props.albumId ? "Failed to load album" : "Failed to load artists");
    }
});

const deleteAlbum = async () => {
    if (!props.albumId) return;
    try {
        await albumService.deleteAlbum(props.albumId);
        toast.success("Album deleted successfully!");
        router.push("/admin/albums");
    } catch (error: any) {
        toast.error("Failed to delete album");
    }
};

const onSubmit = handleSubmit(async (values) => {
    try {
        if (props.albumId) {
            // Calls edit service
            await albumService.updateAlbum(props.albumId, values.title, values.genre as [string], values.year);
            toast.success("Album updated successfully!");
        } else {
            // Calls create service
            await albumService.createAlbum(values.title, values.genre as [string], values.year, values.artistId);
            toast.success("Album created successfully!");
        }
        router.push("/admin/albums");
    } catch (error: any) {
        toast.error(props.albumId ? "Failed to update album" : "Failed to create album");
    }
});
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>{{ currentAlbum ? 'Edit Album' : 'Add New Album' }}</CardTitle>
        </CardHeader>
        <CardContent>
            <form @submit="onSubmit" class="space-y-4">
                <div>
                    <label class="text-sm font-semibold">Artist</label>
                    <Field name="artistId" :validateOnModelUpdate="false" v-slot="{ field }">
                        <select v-bind="field"
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            data-testid="album-artist-select" :class="{ 'border-destructive': errors.artistId }">
                            <option value="" disabled>Select an artist</option>
                            <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                                {{ artist.name }}
                            </option>
                        </select>
                    </Field>
                    <span class="text-sm text-destructive">{{ errors.artistId }}</span>
                </div>

                <div>
                    <label class="text-sm font-semibold">Title</label>
                    <Field name="title" :validateOnModelUpdate="false" v-slot="{ field }">
                        <Input v-bind="field" type="text" placeholder="Add title" data-testid="album-title-input"
                            :class="{ 'border-destructive': errors.title }" />
                    </Field>
                    <span class="text-sm text-destructive">{{ errors.title }}</span>
                </div>

                <div>
                    <label class="text-sm font-semibold">Genres</label>
                    <FieldArray name="genre" v-slot="{ fields, push, remove }">
                        <div class="space-y-2">
                            <div v-for="(field, index) in fields" :key="field.key" class="flex space-x-2">
                                <Field :name="`genre[${index}]`" v-slot="{ field }">
                                    <Input v-bind="field" type="text" placeholder="e.g. Rock"
                                        :data-testid="`album-genre-input-${index}`"
                                        :class="{ 'border-destructive': errors.genre?.[index] }" />
                                </Field>
                                <Button type="button" variant="outline" size="sm" @click="remove(index)"
                                    :disabled="fields.length == 1">
                                    Remove
                                </Button>
                            </div>
                            <Button type="button" variant="outline" size="sm" @click="push('')">
                                Add Genre
                            </Button>
                        </div>
                    </FieldArray>
                    <span v-if="errors.genre" class="text-sm text-destructive">{{ errors.genre }}</span>
                </div>

                <div>
                    <label class="text-sm font-semibold">Year</label>
                    <Field name="year" :validateOnModelUpdate="false" v-slot="{ field }">
                        <Input v-bind="field" type="number" placeholder="Add year" data-testid="album-year-input"
                            :class="{ 'border-destructive': errors.year }" />
                    </Field>
                    <span class="text-sm text-destructive">{{ errors.year }}</span>
                </div>
                <Button type="submit" :disabled="isSubmitting" data-testid="create-album-button">{{ currentAlbum ?
                    'Update Album' : 'Add Album' }}</Button>
            </form>
            <div v-if="currentAlbum" class="mt-4">
                <Button class="bg-red-600 text-white" @click="deleteAlbum" data-testid="delete-album-button">
                    Delete Album
                </Button>
            </div>
        </CardContent>
    </Card>
</template>