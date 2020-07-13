<template>
  <div>
    <template v-if="canRead">
      <h1>
        {{ $t("GENERAL.UNDER_CONSTRUCTION")}}
      </h1>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        {{ $t("GENERAL.NO_PERMISSION") }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";
// import KTPortlet from "@/views/partials/content/Portlet.vue";
// import ContextMenu1 from "@/views/partials/widgets/ContextMenu1.vue";
// import Widget4 from "@/views/partials/widgets/Widget4.vue";
// import Widget5 from "@/views/partials/widgets/Widget5.vue";
// import Widget14_1 from "@/views/partials/widgets/Widget14_MiniDailySales.vue";
// import Widget14_2 from "@/views/partials/widgets/Widget14_MiniProfitShare.vue";
// import Widget14_3 from "@/views/partials/widgets/Widget14_MiniRevenueChange.vue";
// import Widget17 from "@/views/partials/widgets/Widget17.vue";
// import Widget20_1 from "@/views/partials/widgets/Widget20_Inbound.vue";
// import Widget20_2 from "@/views/partials/widgets/Widget20_Outbound.vue";
// import Timeline2 from "@/views/partials/widgets/Timeline2.vue";

/**
 * Sample widgets data source
 */
import timelines from "@/common/mock/widget-timeline.json";
import widget4 from "@/common/mock/widget-4.json";
import widget5 from "@/common/mock/widget-5.json";
import permission from "./mixins/permission";

export default {
  name: "dashboard",
  components: {
    // KTPortlet,
    // ContextMenu1,
    // Widget4,
    // Widget5,
    // Widget14_1,
    // Widget14_2,
    // Widget14_3,
    // Widget17,
    // Widget20_1,
    // Widget20_2,
    // Timeline2
  },
  mixins: [permission],
  data() {
    return {
      timelines: timelines,
      widget4: widget4,
      widget5: widget5,
      tabIndex: 0,
      tabIndex2: 0
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);
  },
  methods: {
    setActiveTab1(event) {
      this.tabIndex = this.setActiveTab(event);
    },
    setActiveTab2(event) {
      this.tabIndex2 = this.setActiveTab(event);
    },
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    }
  }
};
</script>
