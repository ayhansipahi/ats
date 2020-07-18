<template>
  <div>
    <template v-if="canRead">
      <tprsTable
        v-if="selectedItem === null"
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :isCreateVisible="false"
        :canDelete="false"
        :canEdit="false"
        @onSelect="item => onSelect(item, false)"
        @onFilter="onCancel"
      ></tprsTable>

      <tprsForm
        :key="selectedItem && selectedItem.Id"
        v-if="selectedItem !== null"
        :title="title"
        :item="selectedItem"
        :fields="fields"
        :editable="selectedItemEditable"
        :isCreate="isCreating"
        :canDelete="false"
        :canEdit="false"
        @onCancel="onCancel"
        @onDelete="onDelete"
      ></tprsForm>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        {{ $t("GENERAL.NO_PERMISSION") }}
      </b-alert>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_LOG, DELETE_LOG } from "../../store/modules/log";
import permission from "./mixins/permission";
export default {
  name: "log",
  components: { tprsTable, tprsForm },
  mixins: [permission],
  data() {
    return {
      fetching: false,
      selectedItem: null,
      selectedItemEditable: false,
      isCreating: false
    };
  },
  computed: {
    title() {
      return this.$t("TITLE.log");
    },
    fields() {
      return [
        {
          key: "Table",
          label: this.$t("FIELDS.log.table"),
          sortable: true,
          type: "text"
        },
        {
          key: "Method",
          label: this.$t("FIELDS.log.method"),
          sortable: true,
          type: "text"
        },
        {
          key: "User",
          label: this.$t("FIELDS.log.user"),
          sortable: true,
          type: "text"
        },
        {
          key: "RequestJson",
          label: this.$t("FIELDS.log.requestJson"),
          sortable: true,
          type: "textarea"
        },
        {
          key: "ResponseJson",
          label: this.$t("FIELDS.log.responseJson"),
          sortable: true,
          type: "textarea"
        },
        {
          key: "CreatedDate",
          label: this.$t("FIELDS.CreatedDate"),
          sortable: true,
          type: "datetime",
          formatter: value => {
            return this.$moment(value).format("DD.MM.YYYY");
          },
          filterByFormatted: true
        }
      ];
    },
    ...mapState({
      items: state => state.log.items,
      errors: state => state.log.errors
    })
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_LOG,
      setBreadCrumb: SET_BREADCRUMB,
      deleteItem: DELETE_LOG
    }),
    onSelect(item, editable) {
      this.selectedItem = item;
      this.selectedItemEditable = editable;
    },
    onDelete(item) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t("MESSAGES.DELETE_CONFIRM", { name: this.title }),
          {
            okTitle: this.$t("MESSAGES.OK"),
            cancelTitle: this.$t("MESSAGES.CANCEL")
          }
        )
        .then(value => (value ? this.deleteItem(item) : false))
        .then(() => (this.selectedItem = null));
    },
    onCancel() {
      this.reset();
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

<style scoped></style>
