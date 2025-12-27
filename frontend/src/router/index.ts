import { createRouter, createWebHistory } from "vue-router";
import AlbumsView from "@/views/Albums.vue";
import AlbumView from "@/views/Album.vue";
import ArtistView from "@/views/Artist.vue";
import ReviewsView from "@/views/Reviews.vue";
import ReviewFormView from "@/views/ReviewForm.vue";
import LoginView from "@/views/auth/Login.vue";
import RegisterView from "@/views/auth/Register.vue";
import ProfileView from "@/views/Profile.vue";
import DashboardView from "@/views/admin/Dashboard.vue";
import AdminAlbumsView from "@/views/admin/AdminAlbums.vue";
import AdminArtistsView from "@/views/admin/AdminArtists.vue";
import AlbumFormView from "@/views/admin/AlbumForm.vue";
import ArtistFormView from "@/views/admin/ArtistForm.vue";
import { checkAuth, hasCheckedAuth, isLoggedIn, user } from "@/stores/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

const routes = [
  { path: "/", component: AlbumsView, meta: { requiresAuth: true } },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/profile", component: ProfileView, meta: { requiresAuth: true } },
  {
    path: "/albums/:id",
    component: AlbumView,
    meta: { requiresAuth: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/artists/:id",
    component: ArtistView,
    meta: { requiresAuth: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/reviews/:id",
    component: ReviewsView,
    meta: { requiresAuth: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/reviews/form/:id/:yourReviewId?",
    component: ReviewFormView,
    meta: { requiresAuth: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/admin",
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true, // Takes any route parameters into the view component as props
  },
   {
    path: "/admin/albums",
    component: AdminAlbumsView,
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/admin/albums/form/:albumId?",
    component: AlbumFormView,
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/admin/artists",
    component: AdminArtistsView,
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true, // Takes any route parameters into the view component as props
  },
  {
    path: "/admin/artists/form/:artistId?",
    component: ArtistFormView,
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true, // Takes any route parameters into the view component as props
  },
  
    
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  // Check auth once per session on first navigation
  if (!hasCheckedAuth.value) {
    try {
      await checkAuth();
    } catch (error) {
      toast.error("Error checking authentication status.");
    }
  }

  // Redirect to login if trying to access protected route while not authenticated
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return "/login";
  }

  // Redirect to home if trying to access admin route without admin role
  if (to.meta.requiresAdmin && user.value?.role !== "admin") {
    toast.error("Insufficent permissions.");
    return "/";
  }
});

export default router;
