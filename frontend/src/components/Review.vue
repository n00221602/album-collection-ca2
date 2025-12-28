<script setup lang="ts">
import type { Review } from "@/types/index";
import { RouterLink } from "vue-router";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const props = defineProps<{ review: Review }>();

const emit = defineEmits<{ delete: [review: Review] }>();

</script>

<template>
  <Card class="py-4 text-white bg-slate-700">
    <CardHeader>
      <CardTitle class="text-lg">{{ review.userId.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div>
        <h1>Rating: {{ review.rating }}/10</h1>
        <p>{{ review.comment }}</p>
        
        <!-- Add Album image, clicking will lead to that album's details page -->
      </div>
    </CardContent>
  </Card>
</template>
