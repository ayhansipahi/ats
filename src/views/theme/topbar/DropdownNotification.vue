<template>
  <div>
    <div
      class="kt-head kt-head--skin-dark kt-head--fit-x"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <h3 class="kt-head__title">
        Alarms
        <span class="ml-2 btn btn-success btn-sm btn-bold btn-font-md">
          {{ alarms.length }}
        </span>
      </h3>
    </div>

    <perfect-scrollbar
      class="kt-notification kt-margin-t-10 kt-margin-b-10"
      style="max-height: 40vh; position: relative;"
    >
      <template v-for="(alarm, index) in alarms">
        <router-link :key="index" to="alarm" class="kt-notification__item">
          <div class="kt-notification__item-icon">
            <i class="flaticon2-warning kt-font-warning"></i>
          </div>
          <div class="kt-notification__item-details" @click="$emit('onSelect')">
            <div class="kt-notification__item-title">
              {{ alarm.vehiclePlaque }}: {{ alarm.alarmDetails }}
            </div>
          </div>
        </router-link>
      </template>
    </perfect-scrollbar>
  </div>
</template>
<script>
export default {
  name: "KTDropdownNotification",
  computed: {
    alarms() {
      return this.$store.state.alarm.live;
    },
    backgroundImage() {
      return process.env.BASE_URL + "/assets/media/misc/bg-1.jpg";
    }
  }
};
</script>
