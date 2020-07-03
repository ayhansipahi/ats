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
      >
      </tprsTable>

      <tprsForm
        :title="title"
        :key="selectedItem && selectedItem.Id"
        v-if="selectedItem !== null"
        :item="selectedItem"
        :fields="fields"
        :editable="selectedItemEditable"
        :isCreate="isCreating"
        :options="options"
        :isVehicle="true"
        :isCreateVisible="canWrite"
        :canDelete="canDelete"
        :canEdit="canUpdate"
        @onSave="onSave"
        @onCancel="onCancel"
        @onDelete="onDelete"
      >
      </tprsForm>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        You don't have permission to see this page
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
  FETCH_VEHICLE,
  SAVE_VEHICLE,
  CREATE_VEHICLE,
  DELETE_VEHICLE
} from "../../store/modules/vehicle";
import permission from "./mixins/permission";
export default {
  name: "vehicle",
  components: { tprsTable, tprsForm },
  mixins: [permission],
  data() {
    return {
      title: "Araç",
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
          formType: "select",
          formatter: (value, key, item) => {
            return this.options["vehicleType"].find(
              option => option.Id === item[key]
            );
          },
          filterByFormatted: true
        },
        {
          key: "CompanyId",
          label: "Firma",
          sortable: true,
          type: "select",
          options: "company",
          optionName: "CompanyName",
          formType: "select",
          formatter: (value, key, item) => {
            return this.options["company"].find(
              option => option.Id === item[key]
            );
          },
          filterByFormatted: true
        },
        {
          key: "VehicleProductGroupId",
          label: "Ürün Grubu",
          sortable: true,
          type: "select",
          options: "vehicleProductGroup",
          optionName: "VehicleProductName",
          formType: "select",
          formatter: (value, key, item) => {
            return this.options["vehicleProductGroup"].find(
              option => option.Id === item[key]
            );
          },
          filterByFormatted: true
        },
        {
          key: "DriverId",
          label: "Şoför",
          sortable: true,
          type: "select",
          options: "driver",
          optionName: "DriverName",
          formType: "select",
          formatter: (value, key, item) => {
            return this.options["driver"].find(
              option => option.Id === item[key]
            );
          },
          filterByFormatted: true
        },
        {
          key: "CreatedDate",
          label: "Oluşturma Tarihi",
          sortable: true,
          type: "datetime",
          editable: false,
          formType: "datetime",
          formDisable: true,
          formHide: true
        }
      ],
      selectedItem: null,
      selectedItemEditable: false,
      isCreating: false
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
      company: "getCompanies",
      driver: "getDrivers"
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
            ? this.$toastr.success("İşlem Başarılı")
            : this.$toastr.error(data.Message);
        })
        .catch(err => {
          console.log(err);
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
    },
    setParams() {
      if (
        this.items.length > 0 &&
        this.$route.params.hasOwnProperty("vehicleId")
      ) {
        this.selectedItem = this.items.find(
          i => i.Id === parseInt(this.$route.params.vehicleId)
        );
      }
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
    this.$nextTick(this.setParams);
  }
};
</script>

<style scoped></style>
