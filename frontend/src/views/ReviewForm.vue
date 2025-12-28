<script setup lang="ts">
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { reviewSchema } from "@/schemas/review";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReviewInput } from "@/schemas/review";
import reviewService from "@/services/reviews";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import type { Review } from "@/types";
import { ref, onMounted, computed } from "vue";

const router = useRouter();
const toast = useToast();

// The edit/create form will show depending on if the user has a review already
const yourReview = ref<Review | null>(null);

const emit = defineEmits<{ submit: [review: ReviewInput] }>();

const props = defineProps<{ id: string; yourReviewId?: string }>();

const validationSchema = toTypedSchema(reviewSchema);
const { handleSubmit, isSubmitting, errors, setValues } = useForm({
    validationSchema,
    initialValues: {
        rating: undefined,
        comment: "",
        albumId: props.id
    },
});

onMounted(async () => {
    if (props.yourReviewId) {
        yourReview.value = await reviewService.getReview(props.yourReviewId);
        console.log(yourReview.value.review);
        setValues({
            rating: yourReview.value.review.rating,
            comment: yourReview.value.review.comment,
            albumId: props.id
        });
    }
});

const deleteReview = async () => {
    try {
        await reviewService.deleteReview(props.yourReviewId!);
        toast.success("Review deleted successfully!");
        router.push(`/reviews/${props.id}`);
    } catch (error: unknown) {
        toast.error("Failed to delete album.");
    }
};

const onSubmit = handleSubmit(async (values) => {
    try {
        if (props.yourReviewId) {
            // Calls edit service
            await reviewService.updateReview(props.yourReviewId, values.rating, values.comment || "");
            toast.success("Review updated successfully!");
        } else {
            // Calls create service
            await reviewService.createReview(values.rating, values.comment || "", values.albumId);
            toast.success("Review created successfully!");
        }
        router.push(`/reviews/${props.id}`);
    } catch (error: any) {
        if (props.yourReviewId) {
            toast.error(error.response?.data?.message || "Failed to update review");
            return;
        } else {
            toast.error(error.response?.data?.message || "Failed to create review");
        }
    }
});
</script>

<template>
    <div class="container bg-slate-800 m-auto max-w-4xl p-8 shadow-2xl rounded-lg">
        <Card class="bg-slate-700 text-white border-0">
            <CardHeader>
                <CardTitle>{{ yourReview ? 'Edit Review' : 'Add New Review' }}</CardTitle>
            </CardHeader>
            <CardContent>
                <form @submit="onSubmit" class="space-y-4">
                    <div >
                        <label class="text-sm font-semibold">Rating (0-10)</label>
                        <Field class="border-0"name="rating" :validateOnModelUpdate="false" v-slot="{ field }">
                            <Input class="bg-slate-800 text-white border-0" type="number" min="0" max="10" placeholder="Add rating"
                                data-testid="review-rating-input" :class="{ 'border-destructive': errors.rating }" />
                        </Field>
                        <span class="text-sm text-destructive">{{ errors.rating }}</span>
                    </div>

                    <div>
                        <label class="text-sm font-semibold">Comment (optional)</label>
                        <Field name="comment" :validateOnModelUpdate="false" v-slot="{ field }">
                            <Input class="bg-slate-800 text-white border-0" v-bind="field" type="text" placeholder="Add comment"
                                data-testid="review-comment-input" :class="{ 'border-destructive': errors.comment }" />
                        </Field>
                        <span class="text-sm text-destructive">{{ errors.comment }}</span>
                    </div>

                    <Button class="bg-indigo-500 text-white" type="submit" :disabled="isSubmitting" data-testid="submit-review-button">{{ yourReview ?
                        'Update Review' : 'Add Review' }}</Button>
                </form>
                <div v-if="yourReview">
                    <Button class="bg-red-600 text-white mt-2" @click="deleteReview()" data-testid="delete-review-button">
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>