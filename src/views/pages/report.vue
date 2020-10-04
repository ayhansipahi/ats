<template>
  <div>
    <template v-if="canRead">
      <div class="bg-white p-4 mb-4">
        <b-table
            v-if="selectedItem === null"
            :responsive="true"
            id="my-table"
            :items="items"
            :fields="fields"
            striped
            hover
        >
          <template v-for="field in fields" v-slot:[`cell(${field.key})`]="row">
            <template v-if="row.field.type === 'action'">
              <b-btn :key="field.key" @click="onSelect(row.item)">
                {{ $t("FIELDS.report.ReportView") }}
              </b-btn>
            </template>
            <template v-else>{{ row.item[field.key] }}</template>
          </template>
        </b-table>
        <div v-if="selectedItem !== null">
          <b-nav>
            <b-nav-item active @click="reset">
              <b-icon-arrow-left></b-icon-arrow-left>
            </b-nav-item>
            <b-nav-item disabled>
              {{selectedItem.ReportName}}
            </b-nav-item>
          </b-nav>
          <reportView
              :report="selectedItem"
          />
        </div>

      </div>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        {{ $t("GENERAL.NO_PERMISSION") }}
      </b-alert>
    </div>
  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";
import {SET_BREADCRUMB} from "@/store/breadcrumbs.module";
import {FETCH_REPORT} from "@/store/modules/report";
import permission from "./mixins/permission";
import reportView from "./components/reportView.vue"

export default {
  name: "report",
  components: {reportView},
  mixins: [permission],
  data() {
    return {
      fetching: false,
      selectedItem: null
    };
  },
  computed: {
    ...mapState({
      items: state => state.report.items,
      errors: state => state.report.errors
    }),
    title() {
      return this.$t("TITLE.report");
    },
    fields() {
      return [
        {
          key: "ReportName",
          label: this.$t("FIELDS.report.ReportName"),
          sortable: true,
          type: "text"
        },
        {
          key: "ReportValue",
          label: this.$t("FIELDS.report.ReportValue"),
          type: "action"
        }
      ];
    }
  },

  methods: {
    ...mapActions({
      fetchItems: FETCH_REPORT,
      setBreadCrumb: SET_BREADCRUMB
    }),

    onSelect(item) {
      this.selectedItem = item;
    },
    reset() {
      this.selectedItem = null;
      this.selectedItemEditable = false;
      this.isCreating = false;
    }
  },
  async mounted() {
    this.setBreadCrumb([
      {
        title: this.title,
        route: this.$router.route
      }
    ]);
    this.fetching = true;
    await this.fetchItems();
    this.fetching = false;
  }
};
</script>
