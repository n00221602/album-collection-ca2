<script setup lang="ts">
import { RouterView } from "vue-router";
import { isLoggedIn, isLoading, user } from "@/stores/auth";
import { Library } from "lucide-vue-next";
import NavButton from "@/components/NavButton.vue";

</script>

<template>
    <header class="border-b border-slate-700 bg-slate-800">
      <div class="container flex items-center justify-between text-white h-16 px-4 m-auto">
        <div class="flex items-center gap-2 ">
          <Library />
          <h1 class="text-2xl font-bold">Album Collection</h1>
        </div>
        <nav v-if="!isLoading">
          <NavButton v-if="isLoggedIn" to="/">Albums</NavButton>
          <NavButton v-if="!isLoggedIn" to="/login">Login</NavButton>
          <NavButton v-if="!isLoggedIn" to="/register">Register</NavButton>
          <NavButton v-if="isLoggedIn" to="/profile">Profile</NavButton>
          <NavButton v-if="isLoggedIn && user?.role === 'admin'" to="/admin">Admin</NavButton>
        </nav>
      </div>
    </header>
    <main class="py-6 bg-slate-900 text-white">
      <RouterView />
    </main>
</template>
