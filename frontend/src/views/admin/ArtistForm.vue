<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { artistSchema } from "@/schemas/artist";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field, FieldArray } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ArtistInput } from "@/schemas/artist";
import type { Artist } from "@/types";
import artistService from "@/services/artists";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const currentArtist = ref<Artist | null>(null);

const emit = defineEmits<{ submit: [artist: ArtistInput] }>();

const props = defineProps<{ artistId?: string }>();

const validationSchema = toTypedSchema(artistSchema);
const { handleSubmit, isSubmitting, errors, setValues } = useForm({
    validationSchema,
    initialValues: {
        name: "",
        releases: [{ title: "", genre: [""], year: 2025 }],
        bio: "",
    },
});

onMounted(async () => {
    try {
        // If artistId exists, fetch the artist data for editing
        if (props.artistId) {
            currentArtist.value = await artistService.getArtist(props.artistId);
            setValues({
                name: currentArtist.value.name,
                releases: currentArtist.value.releases,
                bio: currentArtist.value.bio,
            });
        }
    } catch (error: any) {
        toast.error("Failed to load artist");
    }
});

const deleteArtist = async () => {
    if (!props.artistId) return;
    try {
        await artistService.deleteArtist(props.artistId);
        toast.success("Artist deleted successfully!");
        router.push("/admin/artists");
    } catch (error: any) {
        toast.error("Failed to delete artist");
    }
};

const onSubmit = handleSubmit(async (values) => {
    try {
        if (props.artistId) {
            // Calls edit service
            await artistService.updateArtist(props.artistId, values.name, values.releases, values.bio);
            toast.success("Artist updated successfully!");
        } else {
            // Calls create service
            await artistService.createArtist(values.name, values.releases, values.bio);
            toast.success("Artist created successfully!");
        }
        router.push("/admin/artists");
    } catch (error: any) {
        toast.error(props.artistId ? "Failed to update artist" : "Failed to create artist");
    }
});

</script>

<template>
    <div class="container bg-slate-800 m-auto max-w-4xl p-8 shadow-2xl rounded-lg">
        <Card class="bg-slate-700 text-white border-0">
            <CardHeader>
                <CardTitle>{{ currentArtist ? 'Edit Artist' : 'Add New Artist' }}</CardTitle>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="onSubmit" class="space-y-4">
                    <div>
                        <label class="text-sm font-semibold">Name</label>
                        <Field name="name" :validateOnModelUpdate="false" v-slot="{ field }">
                            <Input v-bind="field" type="text" placeholder="Add name" data-testid="artist-name-input"
                                class="bg-slate-800 text-white border-0"
                                :class="{ 'border-destructive': errors.name }" />
                        </Field>
                        <span class="text-sm text-destructive">{{ errors.name }}</span>
                    </div>

                    <div>
                        <label class="text-sm font-semibold">Bio</label>
                        <Field name="bio" :validateOnModelUpdate="false" v-slot="{ field }">
                            <Input v-bind="field" type="text" placeholder="Add bio" data-testid="artist-bio-input"
                                class="bg-slate-800 text-white border-0"
                                :class="{ 'border-destructive': errors.bio }" />
                        </Field>
                        <span class="text-sm text-destructive">{{ errors.bio }}</span>
                    </div>

                    <div>
                        <label class="text-sm font-semibold">Releases</label>
                        <FieldArray name="releases" v-slot="{ fields, push, remove }">
                            <div class="space-y-4">
                                <div v-for="(field, index) in fields" :key="field.key"
                                    class="border-0 bg-slate-600 p-4 rounded space-y-2">

                                    <div class="flex justify-between items-center">
                                        <h3 class="font-semibold">Release {{ index + 1 }}</h3>
                                        <Button class="bg-red-800" type="button" size="sm" @click="remove(index)"
                                            :disabled="fields.length == 1">
                                            Remove
                                        </Button>
                                    </div>

                                    <div>
                                        <label class="text-sm font-semibold">Title</label>
                                        <Field :name="`releases[${index}].title`" v-slot="{ field }">
                                            <Input v-bind="field" type="text" placeholder="Add title"
                                                :data-testid="`artist-release-title-input-${index}`"
                                                class="bg-slate-800 text-white border-0" />
                                        </Field>
                                    </div>

                                    <div>
                                        <label class="text-sm font-semibold">Genre</label>
                                        <FieldArray :name="`releases[${index}].genre`"
                                            v-slot="{ fields: genreFields, push, remove }">
                                            <div class="space-y-2">
                                                <div v-for="(genreField, genreIndex) in genreFields"
                                                    :key="genreField.key" class="flex space-x-2">
                                                    <Field :name="`releases[${index}].genre[${genreIndex}]`"
                                                        v-slot="{ field }">
                                                        <Input v-bind="field" type="text" placeholder="e.g. Rock"
                                                            :data-testid="`artist-release-genre-input-${index}-${genreIndex}`"
                                                            class="bg-slate-800 text-white border-0" />
                                                    </Field>
                                                    <Button class="bg-red-800" type="button" size="sm"
                                                        @click="remove(genreIndex)" :disabled="genreFields.length == 1">
                                                        Remove
                                                    </Button>
                                                </div>
                                                <Button class="bg-emerald-800" type="button" size="sm" @click="push('')">
                                                    Add Genre
                                                </Button>
                                            </div>
                                        </FieldArray>
                                    </div>

                                    <div>
                                        <label class="text-sm font-semibold">Year</label>
                                        <Field :name="`releases[${index}].year`" v-slot="{ field }">
                                            <Input v-bind="field" type="number" placeholder="Add year"
                                                :data-testid="`artist-release-year-input-${index}`"
                                                class="bg-slate-800 text-white border-0" />
                                        </Field>
                                    </div>
                                </div>
                                <Button class="bg-emerald-800" type="button"
                                    @click="push({ title: '', genre: [''], year: 2025 })">
                                    Add Release
                                </Button>
                            </div>
                        </FieldArray>
                    </div>

                    <div>
                        <Button class="bg-indigo-500 text-white" type="submit" :disabled="isSubmitting" data-testid="submit-artist-button">{{
                            currentArtist ?
                            'Update Artist' : 'Add Artist' }}</Button>
                    </div>
                </form>
                <div v-if="currentArtist" class="mt-4">
                    <Button class="bg-red-600 text-white" @click="deleteArtist" data-testid="delete-artist-button">
                        Delete Artist
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>