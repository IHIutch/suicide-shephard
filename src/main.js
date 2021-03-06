// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import "~/assets/scss/main.scss";
import { BootstrapVue } from "bootstrap-vue";

import DefaultLayout from "~/layouts/Default.vue";

export default function(Vue, { router, head, isClient }) {
  Vue.use(BootstrapVue);

  Vue.component("Layout", DefaultLayout);
}
