<template>
  <div>
    <!--begin: Navigation -->
    <div class="kt-notification">
      <div class="kt-notification__custom kt-space-between">
        <a
          href="#"
          v-on:click="onLogout()"
          class="btn btn-label btn-label-brand btn-sm btn-bold flex-grow-1"
        >
          {{ $t("AUTH.LOGOUT") }}
        </a>
      </div>
    </div>
    <!--end: Navigation -->
  </div>
</template>

<script>
import { LOGOUT } from "@/store/auth.module";

export default {
  name: "KTDropdownUser",
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    }
  },
  computed: {
    backgroundImage() {
      return process.env.BASE_URL + "assets/media/misc/bg-1.jpg";
    }
  }
};
</script>
