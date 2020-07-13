<template>
  <div>
    <template v-if="canRead">
      <tprsTable
        v-if="selectedItem === null"
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :options="options"
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
        :key="selectedItem && selectedItem.Id"
        v-if="selectedItem !== null"
        :title="title"
        :item="selectedItem"
        :fields="fields"
        :editable="selectedItemEditable"
        :isCreate="isCreating"
        :options="options"
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
import { mapActions, mapState, mapGetters } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_PRODUCT,
  SAVE_PRODUCT,
  CREATE_PRODUCT,
  DELETE_PRODUCT
} from "../../store/modules/product";
import permission from "./mixins/permission";
export default {
  name: "product",
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
      return this.$t("TITLE.product");
    },
    fields() {
      return [
        {
          key: "ProductName",
          label: this.$t("FIELDS.product.ProductName"),
          sortable: true,
          type: "text"
        },
        {
          key: "ProductCode",
          label: this.$t("FIELDS.product.ProductCode"),
          sortable: true,
          type: "text"
        },
        {
          key: "Explanation",
          label: this.$t("FIELDS.product.Explanation"),
          sortable: true,
          type: "text"
        },
        {
          key: "CreatedDate",
          label: this.$t("FIELDS.CreatedDate"),
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
      items: state => state.product.items,
      errors: state => state.product.errors
    }),
    ...mapGetters({}),
    optionsList() {
      return this.fields
        .filter(field => field.hasOwnProperty("options"))
        .map(field => field.options);
    },
    options() {
      return this.optionsList.reduce((p, n) => {
        p[n] = this[n];
        return p;
      }, {});
    }
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_PRODUCT,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_PRODUCT,
      createItem: CREATE_PRODUCT,
      deleteItem: DELETE_PRODUCT
    }),
    fetchOptions() {
      this.optionsList.forEach(option => {
        const actionName = `FETCH_${option.toUpperCase()}`;
        this.$store.dispatch(actionName);
      });
    },
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
    await this.fetchOptions();
    await this.fetchItems();
    this.fetching = false;
  }
};
</script>

<style scoped></style>
