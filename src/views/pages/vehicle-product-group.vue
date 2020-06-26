<template>
  <div>
    <transition name="fade">
      <tprsTable
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :editable="true"
        :isCreateVisible="true"
        @onNew="onNew"
        @onSelect="item => onSelect(item, false)"
        @onDelete="onDelete"
        @onEdit="item => onSelect(item, true)"
        @onFilter="onCancel"
      ></tprsTable>
    </transition>
    <tprsForm
      v-if="selectedItem !== null"
      :key="selectedItem.Id"
      :item="selectedItem"
      :fields="fields"
      :editable="selectedItemEditable"
      :isCreate="isCreate"
      @onSave="onSave"
      @onCancel="onCancel"
      @onDelete="onDelete"
    ></tprsForm>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_VEHICLEPRODUCTGROUP,
  SAVE_VEHICLEPRODUCTGROUP,
  CREATE_VEHICLEPRODUCTGROUP,
  DELETE_VEHICLEPRODUCTGROUP
} from "../../store/modules/vehicleProductGroup";
export default {
  name: "vehicleProductGroup",
  components: { tprsTable, tprsForm },
  data() {
    return {
      title: "Araç Ürün Grubu",
      fetching: false,
      fields: [
        {
          key: "VehicleProductCode",
          label: "Araç Ürün Kodu",
          sortable: true,
          type: "text"
        },
        {
          key: "VehicleProductName",
          label: "Araç Ürün Adı",
          sortable: true,
          type: "text"
        },
        {
          key: "Explanation",
          label: "Açıklama",
          sortable: true,
          type: "text"
        },
        {
          key: "CreatedDate",
          label: "Oluşturma Tarihi",
          sortable: true,
          type: "datetime",
          editable: false,
          formType: "datetime",
          formDisable: true
        }
      ],
      selectedItem: null,
      selectedItemEditable: false,
      isCreate: false
    };
  },
  computed: {
    ...mapState({
      items: state => state.vehicleProductGroup.items
    })
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_VEHICLEPRODUCTGROUP,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_VEHICLEPRODUCTGROUP,
      createItem: CREATE_VEHICLEPRODUCTGROUP,
      deleteItem: DELETE_VEHICLEPRODUCTGROUP
    }),
    onSelect(item, editable) {
      this.selectedItem = item;
      this.selectedItemEditable = editable;
    },
    onDelete(item) {
      this.$bvModal
        .msgBoxConfirm(this.title + " silinsin mi?", {
          okTitle: "Evet",
          cancelTitle: "Hayır"
        })
        .then(value => (value ? this.deleteItem(item) : false))
        .then(() => (this.selectedDriver = null));
    },
    onSave(item) {
      (this.isCreating ? this.createItem : this.saveItem)(item).then(data =>
        data.IsSuccess ? this.reset() : false
      );
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
