import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/podcasts",
    name: "podcasts",
    component: () =>
      import(/* webpackChunkName: "podcasts" */ "@/views/Podcasts.vue")
  },
  {
    path: "/podcast/:id",
    name: "podcast",
    component: () =>
      import(/* webpackChunkName: "podcasts" */ "@/views/Podcast.vue")
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import(/* webpackChunkName: "auth" */ "@/views/Auth.vue")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/Admin.vue"),
    meta: {
      requiresAuth: true,
      requiresRole: "admin"
    }
  },
  {
    path: "/root",
    name: "root",
    component: () => import(/* webpackChunkName: "root" */ "@/views/Root.vue"),
    meta: {
      requiresAuth: true,
      requiresRole: "root"
    }
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import(/* webpackChunkName: "chat" */ "@/views/Chat.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/share",
    name: "share",
    component: () =>
      import(/* webpackChunkName: "share" */ "@/views/Share.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile/:username?",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/Profile.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/groups",
    name: "groups",
    component: () =>
      import(/* webpackChunkName: "groups" */ "@/views/Groups.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/group/:title",
    name: "group",
    component: () =>
      import(/* webpackChunkName: "group" */ "@/views/Group.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/*",
    name: "Error404",
    component: () =>
      import(/* webpackChunkName: "error404" */ "@/views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  let auth = store.getters.isLoggedIn;
  if (!auth) {
    // try to load auth
    store
      .dispatch("syncAuth")
      .then(flag => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          // this route requires auth, check if logged in
          // if not, send to login page with redirect
          if (!flag) {
            next({
              path: "/auth",
              query: { redirect: to.fullPath }
            });
          } else {
            next();
          }
        } else {
          next();
        }
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    next();
  }
});

export default router;
