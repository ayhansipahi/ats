<template>
  <div class="kt-grid kt-grid--hor kt-grid--root">
    <KTHeaderMobile></KTHeaderMobile>
    <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"></Loader>
    <div
      class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page"
    >
      <KTAside v-if="asideEnabled"></KTAside>
      <div
        class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
        id="kt_wrapper"
      >
        <KTHeader></KTHeader>
        <div
          class="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
          id="kt_content"
        >
          <KTSubheader
            v-if="subheaderDisplay"
            v-bind:breadcrumbs="breadcrumbs"
            v-bind:title="pageTitle"
          ></KTSubheader>
          <div
            class="kt-container kt-grid__item kt-grid__item--fluid"
            v-bind:class="{ 'kt-container--fluid': contentFluid }"
          >
            <transition name="fade-in-up">
              <router-view></router-view>
            </transition>
          </div>
        </div>
        <KTFooter></KTFooter>
      </div>
    </div>
    <KTStickyToolbar v-if="toolbarDisplay"></KTStickyToolbar>
    <KTQuickPanel></KTQuickPanel>
    <KTScrollTop></KTScrollTop>
  </div>
</template>
<style>
.kt-sticky-toolbar {
  display: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s !important;
}

.fade-enter {
  opacity: 0 !important;
}

.fade-leave-to {
  opacity: 0 !important;
  transform: rotateY(90deg);
  transition: all 0s !important;
}

.row-end {
  margin-right: 1px;
}

*:disabled {
  background: #ebedf2ab !important;
  border-color: #ebedf2ab !important;
  transition: all 0.5s;
}

.form-buttons .fa {
  font-size: 20px;
  padding: 4px 8px;
  position: relative;
  top: 4px;
  right: 10px;
  cursor: pointer;
}

#table_component th {
  padding: 0 !important;
  cursor: pointer;
  background: transparent;
}

#table_component th div {
  padding: 1rem 0.75rem 0.75rem !important;
  background: #ebedf2;
  white-space: nowrap;
  min-width: 100px !important;
}

#table_component th div.sort-changed:after {
  content: "\25BC";
  float: right;
  transform: rotate(0deg);
  color: #b9b9b9;
}

#table_component th div.sorted:after {
  transform: rotate(180deg);
}

#table_component .fa {
  font-size: 16px;
  padding-left: 0.35rem;
  padding-right: 0.35rem;
  cursor: pointer;
}

#table_component .fa.fa-trash-alt {
  color: #f23f76;
}

#table_component .fa.fa-edit {
  color: #6ec0ff;
}

#table_component .fa.fa-info-circle {
  color: #5867dd;
}

#table_component th input,
#table_component th select {
  width: calc(100% - 0.5rem);
  outline: none;
  padding: 0.25rem 0.5rem !important;
  margin: 0.25rem 0 0.25rem 0 !important;
  border: 1px solid #cfcfcf;
  font-size: 14px;
  background: white !important;
}

#table_component th:last-child input,
#table_component th:last-child select {
  width: calc(100% - 1px);
}

#filter_i {
  color: grey !important;
}

#filter_i.active {
  color: #5867dd !important;
}
.table-hr {
  background: #f2f3f8;
  height: 2px;
  border: 0;
  width: calc(100% + 3rem);
  margin: 4px -1.5rem 18px -1.5rem;
}
.yetki-table {
  border: 1px solid #ebedf2;
}
.yetki-table td {
  border-right: 1px solid #ebedf2;
  padding: 12px 14px;
  min-width: 130px !important;
}
.yetki-table td:last-child {
  border-right: 0 !important;
}
.yetki-table td:first-child {
  font-weight: bold;
  text-align: right;
  color: #5c6573;
}
.yetki-table td:first-child:after {
  content: " : ";
}
.yetki-table label {
  margin-left: 10px;
  margin-top: 1px;
}
.form-check-input {
  position: relative !important;
  margin-top: 0 !important;
  margin-left: 0 !important;
  top: 3px;
}
.yetki-table tr:nth-child(even) {
  background: #f6f7f9;
}
.yetki-table tr:nth-child(even) td:first-child {
  background: #e8e9ec;
}
.yetki-table tr:nth-child(odd) td:first-child {
  background: #fbfbfb;
}
.m-t-0 {
  margin-top: 0 !important;
}
.toast-message {
  font-size: 14px !important;
}
.lds-dual-ring {
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ced1dc;
  border-color: #ced1dc transparent #ced1dc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<script>
import { mapGetters } from "vuex";
import KTAside from "@/views/theme/aside/Aside.vue";
import KTHeader from "@/views/theme/header/Header.vue";
import KTHeaderMobile from "@/views/theme/header/HeaderMobile.vue";
import KTFooter from "@/views/theme/footer/Footer.vue";
import HtmlClass from "@/common/htmlclass.service";
import KTSubheader from "@/views/theme/subheader/Subheader.vue";
import KTStickyToolbar from "@/views/partials/layout/StickyToolbar.vue";
import KTQuickPanel from "@/views/partials/layout/QuickPanel.vue";
import KTScrollTop from "@/views/partials/layout/ScrollTop";
import Loader from "@/views/partials/content/Loader.vue";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME
} from "@/store/htmlclass.module.js";

export default {
  name: "Base",
  components: {
    KTAside,
    KTHeader,
    KTHeaderMobile,
    KTFooter,
    KTSubheader,
    KTStickyToolbar,
    KTQuickPanel,
    KTScrollTop,
    Loader
  },
  beforeMount() {
    // show page loading
    this.$store.dispatch(ADD_BODY_CLASSNAME, "kt-page--loading");

    // initialize html element classes
    HtmlClass.init();
  },
  mounted() {
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }

    // Simulate the delay page loading
    setTimeout(() => {
      // Remove page loader after some time
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "kt-page--loading");

      if (window.location.hash === "#/" || window.location.hash === "#/#") {
        document.getElementsByClassName("kt-menu__link")[0].click();
      }
    }, 2000);
  },
  methods: {},
  computed: {
    path: function() {
      return this.$route.path;
    },
    ...mapGetters([
      "isAuthenticated",
      "breadcrumbs",
      "pageTitle",
      "layoutConfig"
    ]),

    /**
     * Check if the page laoder is enabled
     * @returns {boolean}
     */
    loaderEnabled() {
      return !!this.layoutConfig("loader.enabled");
    },

    /**
     * Check if container width is fluid
     * @returns {boolean}
     */
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
    },

    /**
     * Page loader logo image using require() function
     * @returns {string}
     */
    loaderLogo() {
      return process.env.BASE_URL + this.layoutConfig("loader.logo");
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },

    /**
     * Set the right toolbar display
     * @returns {boolean}
     */
    toolbarDisplay() {
      return !!this.layoutConfig("toolbar.display");
    },

    /**
     * Set the subheader display
     * @returns {boolean}
     */
    subheaderDisplay() {
      return !!this.layoutConfig("subheader.display");
    }
  },
  watch: {
    path() {
      this.$store.state.config.key++;
    }
  }
};
</script>
