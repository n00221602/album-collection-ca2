<script setup lang="ts">
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { albumSchema } from "@/schemas/album";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field, FieldArray } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AlbumInput } from "@/schemas/album";
import albumService from "@/services/albums";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const emit = defineEmits<{ submit: [album: AlbumInput] }>();

const props = defineProps<{ id: string }>();

const validationSchema = toTypedSchema(albumSchema);
const { handleSubmit, isSubmitting, errors, resetForm } = useForm({
    validationSchema,
    initialValues: {
        title: "",
        genre: [""],
        year: 2025,
        artistId: props.id,
    },
});

const onSubmit = handleSubmit(async (values) => {
    try {
        await albumService.createAlbum(values.title, values.genre as [string], values.year);
        toast.success("Album created successfully!");
        resetForm();
        router.push("/admin/albums");
    } catch (error: any) {
        toast.error("Failed to create album");
    }
});
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Add New Artist</CardTitle>
        </CardHeader>
        <CardContent>
            <form @submit="onSubmit" class="space-y-4">
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
                <Button type="submit" :disabled="isSubmitting" data-testid="create-album-button">Add Album</Button>
            </form>
        </CardContent>
    </Card>
</template>