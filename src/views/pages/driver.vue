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
        :title="title"
        :key="selectedItem && selectedItem.Id"
        v-if="selectedItem !== null"
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
  FETCH_DRIVER,
  SAVE_DRIVER,
  CREATE_DRIVER,
  DELETE_DRIVER
} from "../../store/modules/driver";
import permission from "./mixins/permission";
export default {
  name: "driver",
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
      return this.$t("TITLE.driver");
    },
    fields() {
      return [
        {
          key: "TCKN",
          label: this.$t("FIELDS.driver.TCKN"),
          sortable: true,
          type: "text",
          formType: "text",
          mask: "###########"
        },
        {
          key: "DriverName",
          label: this.$t("FIELDS.driver.DriverName"),
          sortable: true,
          type: "text",
          formRequired: true
        },
        {
          key: "Phone",
          label: this.$t("FIELDS.driver.Phone"),
          sortable: true,
          type: "text",
          formType: "text",
          mask: "#?#############################"
        },
        {
          key: "Email",
          label: this.$t("FIELDS.driver.Email"),
          sortable: true,
          type: "text",
          formType: "email"
        },
        {
          key: "Address",
          label: this.$t("FIELDS.driver.Address"),
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
      items: state => state.driver.items
    })
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_DRIVER,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_DRIVER,
      createItem: CREATE_DRIVER,
      deleteItem: DELETE_DRIVER
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
