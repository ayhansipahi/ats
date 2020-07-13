<template>
  <div>
    <template v-if="canRead">
      <tprsTable
        v-if="selectedItem === null"
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :isCreateVisible="canWrite"
        :canDelete="canDelete"
        :canEdit="canUpdate"
        @onNew="onNew"
        @onSelect="item => onSelect(item, false)"
        @onDelete="onDelete"
        @onEdit="item => onSelect(item, true)"
        @onFilter="onCancel"
      ></tprsTable>

      <tprsForm
        v-if="selectedItem !== null"
        :title="title"
        :key="selectedItem && selectedItem.Id"
        :item="selectedItem"
        :fields="fields"
        :editable="selectedItemEditable"
        :isCreate="isCreating"
        :isCreateVisible="canWrite"
        :canDelete="canDelete"
        :canEdit="canUpdate"
        @onSave="onSave"
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
import {
  FETCH_SENSORTYPE,
  SAVE_SENSORTYPE,
  CREATE_SENSORTYPE,
  DELETE_SENSORTYPE
} from "../../store/modules/sensorType";
import permission from "./mixins/permission";
export default {
  name: "sensorType",
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
      return this.$t("TITLE.sensorType");
    },
    fields() {
      return [
        {
          key: "SensorTypeCode",
          label: this.$t("FIELDS.sensorType.SensorTypeCode"),
          sortable: true,
          type: "text",
          formType: "number"
        },
        {
          key: "SensorTypeName",
          label: this.$t("FIELDS.sensorType.SensorTypeNam"),
          sortable: true,
          type: "text"
        },
        {
          key: "CreatedDate",
          label: this.$t("FIELDS.CreateDate"),
          sortable: true,
          type: "datetime",
          editable: false,
          formType: "datetime",
          formDisable: true,
          formHide: true,
          formatter: value => {
            return this.$moment(value).format("DD.MM.YYYY");
          },
          filterByFormatted: true
        }
      ];
    },
    ...mapState({
      items: state => state.sensorType.items
    })
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_SENSORTYPE,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_SENSORTYPE,
      createItem: CREATE_SENSORTYPE,
      deleteItem: DELETE_SENSORTYPE
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
        .then(() => (this.selectedDriver = null));
    },
    onSave(item) {
      (this.isCreating ? this.createItem : this.saveItem)(item)
        .then(data => {
          if (data.IsSuccess) {
            this.reset();
            return true;
          } else {
            return data;
          }
        })
        .then(data => {
          data === true
            ? this.$toastr.success(this.$t("MESSAGES.SUCCESS"))
            : this.$toastr.error(data.Message);
        })
        .catch(err => {
          if (typeof this.errors === "object") {
            Object.keys(this.errors).forEach(key => {
              const errorTitle = this.fields.find(field => field.key === key)
                .label;
              const errorText = this.errors[key];
              this.$toastr.error(`<b>${errorTitle}</b> <br/>${errorText}`);
            });
          } else {
            this.$toastr.error(err.message);
          }
        });
    },
    onCancel() {
      this.reset();
    },
    onNew() {
      this.selectedItem = this.fields.reduce((p, n) => {
        p[n.key] = n.type === "multiselect" ? [] : null;
        return p;
      }, {});
      this.selectedItemEditable = true;
      this.isCreating = true;
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
