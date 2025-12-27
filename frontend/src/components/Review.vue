<script setup lang="ts">
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { reviewSchema } from "@/schemas/review";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReviewInput } from "@/schemas/review";

const emit = defineEmits<{ submit: [review: ReviewInput] }>();

const props = defineProps<{ albumId: string }>();

const validationSchema = toTypedSchema(reviewSchema);

const { handleSubmit, isSubmitting, errors, resetForm } = useForm({
  validationSchema,
  initialValues: {
    rating: 5,
    comment: "",
    albumId: props.albumId,
  },
});

const onSubmit = handleSubmit(async (values) => {
  emit("submit", values as ReviewInput);
  resetForm();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Add New Review</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label class="text-sm font-semibold">Rating (0-10)</label>
          <Field name="rating" :validateOnModelUpdate="false" v-slot="{ field }">
            <Input v-bind="field" type="number" min="0" max="10" placeholder="Add rating"
              data-testid="review-rating-input" :class="{ 'border-destructive': errors.rating }" />
          </Field>
          <span class="text-sm text-destructive">{{ errors.rating }}</span>
        </div>

        <div>
          <label class="text-sm font-semibold">Comment (optional)</label>
          <Field name="comment" :validateOnModelUpdate="false" v-slot="{ field }">
            <Input v-bind="field" type="text" placeholder="Add comment" data-testid="review-comment-input"
              :class="{ 'border-destructive': errors.comment }" />
          </Field>
          <span class="text-sm text-destructive">{{ errors.comment }}</span>
        </div>
        
        <Button type="submit" :disabled="isSubmitting" data-testid="create-review-button">Add Review</Button>
      </form>
    </CardContent>
  </Card>
</template>
