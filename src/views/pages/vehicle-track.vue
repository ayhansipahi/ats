<template>
  <div>
    <template v-if="canRead">
      <transition name="fade">
        <div class="row">
          <div class="col-12 bg-white px-4 pt-4 pb-0 mb-4">
            <b-form class="row" @submit.prevent="onGetItems">
              <div class="form-group col-12 col-sm-6 col-md-3 mb-4">
                <b-form-select
                  v-model="formCompany"
                  @change="onCompanySelect"
                  :options="formCompanyOptions"
                  required
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null">
                      Bir Firma seçin
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </div>

              <div class="form-group col-12 col-sm-6 col-md-3 mb-4">
                <b-form-select
                  v-model="formVehicle"
                  :options="formVehicleOptions"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null">
                      Bir Araç seçin
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </div>

              <div class="form-group col-12 col-sm-6 col-md-3 col-lg-2 mb-4">
                <b-form-datepicker
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }"
                  locale="tr"
                  v-model="startDate"
                  :max="endDate || new Date().toISOString().split('T')[0]"
                >
                </b-form-datepicker>
              </div>

              <div class="form-group col-12 col-sm-6 col-md-3 col-lg-2 mb-4">
                <b-form-datepicker
                  locale="tr"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }"
                  v-model="endDate"
                  :min="startDate"
                  :max="new Date().toISOString().split('T')[0]"
                >
                </b-form-datepicker>
              </div>

              <div class="form-group col-12 col-lg-2 mb-4">
                <b-button
                  type="submit"
                  :variant="formCompany ? 'primary' : 'ghost'"
                  block
                  :disabled="!formCompany"
                >
                  Ara
                </b-button>
              </div>
            </b-form>
          </div>
        </div>
      </transition>
      <tprsTable
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :options="options"
        :editable="false"
        :isCreateVisible="false"
        :canDelete="canDelete"
        :canEdit="canUpdate"
        @onSelect="item => onSelect(item, false)"
        onDelete="onDelete"
        @onEdit="item => onSelect(item, true)"
        @onFilter="onCancel"
      ></tprsTable>
      <tprsForm
        v-if="selectedItem !== null"
        :key="selectedItem"
        :item="selectedItem"
        :fields="fields"
        :editable="selectedItemEditable"
        :isCreate="isCreate"
        :options="options"
        :isCreateVisible="canWrite"
        :canDelete="canDelete"
        :canEdit="canUpdate"
        onSave="onSave"
        @onCancel="onCancel"
        onDelete="onDelete"
      ></tprsForm>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        You don't have permission to see this page
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_VEHICLEDETAILS } from "../../store/modules/vehicleDetails";
import permission from "./mixins/permission";

export default {
  name: "vehicleTrack",
  components: { tprsTable, tprsForm },
  mixins: [permission],
  data() {
    return {
      title: "Araç Hareketleri",
      fetching: false,
      fields: [
        { options: "company", optionName: "CompanyName" },
        {
          key: "VehicleId",
          label: "Plaka",
          sortable: true,
          type: "select",
          options: "vehicle",
          optionName: "Plaque",
          formType: "select"
        },
        {
          key: "DriverId",
          label: "Şöför",
          sortable: true,
          type: "select",
          options: "driver",
          optionName: "DriverName",
          formType: "select"
        },
        {
          key: "Km",
          label: "KM",
          sortable: true,
          type: "number",
          formType: "number"
        },
        {
          key: "Speed",
          label: "Hız",
          sortable: true,
          type: "number",
          formType: "number"
        },
        {
          key: "Latitude",
          label: "Enlem",
          sortable: true,
          type: "number",
          formType: "number"
        },
        {
          key: "Longitude",
          label: "Boylam",
          sortable: true,
          type: "number",
          formType: "number"
        },
        {
          key: "Location",
          label: "Konum",
          sortable: true,
          type: "string"
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
      isCreate: false,
      startDate: null, // new Date(),
      endDate: null, // new Date(),
      formCompany: null,
      formVehicle: null
    };
  },
  computed: {
    ...mapState({
      items: state => state.vehicleDetails.items
    }),
    ...mapGetters({
      vehicle: "getVehicles",
      company: "getCompanies",
      driver: "getDrivers",
      getVehicleByCompanyId: "getVehicleByCompanyId"
    }),
    formVehicleOptions() {
      return (this.formCompany !== null
        ? this.getVehicleByCompanyId(this.formCompany)
        : []
      ).map(v => ({
        value: v.Id,
        text: v.Plaque
      }));
    },
    formCompanyOptions() {
      return this.options.company.map(v => ({
        value: v.Id,
        text: v.CompanyName
      }));
    },
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
      fetchItems: FETCH_VEHICLEDETAILS,
      setBreadCrumb: SET_BREADCRUMB
    }),
    onCompanySelect() {
      this.formVehicle = null;
    },
    onGetItems() {
      this.fetchItems({
        StartDate: this.startDate,
        EndDate: this.endDate,
        CompanyId: this.formCompany,
        VehicleId: this.formVehicle
      });
    },
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
    /* await this.fetchItems({
      StartDate: this.startDate,
      EndDate: this.endDate,
      CompanyId: this.formCompany,
      VehicleId: this.formVehicle
    });*/
    await this.fetchOptions();
  }
};
</script>

<style scoped></style>
