<script setup lang="ts">
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { artistSchema } from "@/schemas/artist";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ArtistInput } from "@/schemas/artist";
import artistService from "@/services/artists";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const emit = defineEmits<{ submit: [artist: ArtistInput] }>();

const props = defineProps<{ artistId: string }>();

const validationSchema = toTypedSchema(artistSchema);
const { handleSubmit, isSubmitting, errors, resetForm } = useForm({
    validationSchema,
    initialValues: {
        name: "",
        releases: [],
        bio: "",
    },
});

const onSubmit = handleSubmit(async (values) => {
    try {
        await artistService.createArtist(values.name, values.releases, values.bio);
        toast.success("Artist created successfully!");
        resetForm();
        router.push("/admin/artists");
    } catch (error: any) {
        toast.error("Failed to create artist");
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
                    <label class="text-sm font-semibold">Name</label>
                    <Field name="name" :validateOnModelUpdate="false" v-slot="{ field }">
                        <Input v-bind="field" type="text" placeholder="Add name" data-testid="artist-name-input"
                            :class="{ 'border-destructive': errors.name }" />
                    </Field>
                    <span class="text-sm text-destructive">{{ errors.name }}</span>
                </div>

                <div>
                    <label class="text-sm font-semibold">Bio</label>
                    <Field name="bio" :validateOnModelUpdate="false" v-slot="{ field }">
                        <Input v-bind="field" type="text" placeholder="Add bio" data-testid="artist-bio-input"
                            :class="{ 'border-destructive': errors.bio }" />
                    </Field>
                    <span class="text-sm text-destructive">{{ errors.bio }}</span>
                </div>

                <div>
                    <h2 class="text-lg font-bold mb-2">Releases</h2>
                    <Button>Add Album</Button>
                </div>
            </form>
        </CardContent>
    </Card>
</template>