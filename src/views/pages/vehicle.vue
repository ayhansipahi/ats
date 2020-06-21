<template>
  <div>
    <transition name="fade">
      <tprsTable
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :options="options"
        :editable="true"
        :isCreateVisible="true"
        @onNew="onNew"
        @onSelect="item => onSelect(item, false)"
        @onDelete="onDelete"
        @onEdit="item => onSelect(item, true)"
        @onFilter="onCancel"
      >
      </tprsTable>
    </transition>
    <tprsForm
      :key="selectedItem.Id"
      v-if="selectedItem !== null"
      :item="selectedItem"
      :fields="fields"
      :editable="selectedItemEditable"
      :isCreate="isCreate"
      :options="options"
      :isVehicle="true"
      @onSave="onSave"
      @onCancel="onCancel"
      @onDelete="onDelete"
    >
    </tprsForm>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_VEHICLE,
  SAVE_VEHICLE,
  CREATE_VEHICLE,
  DELETE_VEHICLE
} from "../../store/modules/vehicle";
export default {
  name: "vehicle",
  components: { tprsTable, tprsForm },
  data() {
    return {
      title: "Şoför",
      fetching: false,
      fields: [
        {
          key: "Plaque",
          label: "Plaka",
          sortable: true,
          type: "text"
        },
        {
          key: "Capacity",
          label: "Kapasite",
          sortable: true,
          type: "text",
          formType: "number"
        },
        {
          key: "VehicleTypeId",
          label: "Araç Tipi",
          sortable: true,
          type: "select",
          options: "vehicleType",
          optionName: "TypeName",
          formType: "select"
        },
        {
          key: "CompanyId",
          label: "Firma",
          sortable: true,
          type: "select",
          options: "company",
          optionName: "CompanyName",
          formType: "select"
        },
        {
          key: "VehicleProductGroupId",
          label: "Ürün Grubu",
          sortable: true,
          type: "select",
          options: "vehicleProductGroup",
          optionName: "VehicleProductName",
          formType: "select"
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
      items: state => state.vehicle.items,
      errors: state => state.vehicle.errors
    }),
    ...mapGetters({
      vehicleType: "getVehicleTypes",
      vehicleProductGroup: "getVehicleProductGroups",
      company: "getCompanies"
    }),
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
      fetchItems: FETCH_VEHICLE,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_VEHICLE,
      createItem: CREATE_VEHICLE,
      deleteItem: DELETE_VEHICLE
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
        .msgBoxConfirm(this.title + " silinsin mi?", {
          okTitle: "Evet",
          cancelTitle: "Hayır"
        })
        .then(value => (value ? this.deleteItem(item) : false))
        .then(() => (this.selectedItem = null));
    },
    onSave(item) {
      (this.isCreating ? this.createItem : this.saveItem)(item)
        .then(data => (data.IsSuccess ? this.reset() && true : data))
        .then(data => {
          data === true
            ? this.$toastr.success("İşlem Başarılı")
            : this.$toastr.error(data.Message);
        })
        .catch(() => {
          Object.keys(this.errors).forEach(key => {
            const errorTitle = this.fields.find(field => field.key === key)
              .label;
            const errorText = this.errors[key];
            this.$toastr.error(`<b>${errorTitle}</b> <br/>${errorText}`);
          });
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
    await this.fetchOptions();
    this.fetching = false;
  }
};
</script>

<style scoped></style>
