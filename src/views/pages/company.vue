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
      ></tprsTable>
    </transition>
    <tprsForm
      :key="selectedItem.Id"
      v-if="selectedItem !== null"
      :item="selectedItem"
      :fields="fields"
      :editable="selectedItemEditable"
      :isCreate="isCreate"
      :options="options"
      @onSave="onSave"
      @onCancel="onCancel"
      @onDelete="onDelete"
    ></tprsForm>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_COMPANY,
  SAVE_COMPANY,
  CREATE_COMPANY,
  DELETE_COMPANY
} from "../../store/modules/company";
export default {
  name: "company",
  components: { tprsTable, tprsForm },
  data() {
    return {
      title: "Firmalar",
      fetching: false,
      fields: [
        {
          key: "CompanyName",
          label: "Firma Adı",
          sortable: true,
          type: "text"
        },
        {
          key: "CompanyTradeName",
          label: "Firma Ticari Adı",
          sortable: true,
          type: "text"
        },
        {
          key: "CompanyEmail",
          label: "E-Mail",
          sortable: true,
          type: "text"
        },
        {
          key: "Phone",
          label: "Telefon",
          sortable: true,
          type: "text"
        },
        {
          key: "AuthorizedPerson",
          label: "Yetkili Kişi",
          sortable: true,
          type: "text"
        },
        {
          key: "AuthorizedPhone",
          label: "Yetkili Telefon",
          sortable: true,
          type: "text"
        },
        {
          key: "AuthorizedEmail",
          label: "Yetkili E-mail",
          sortable: true,
          type: "text"
        },
        {
          key: "LogoFilePath",
          label: "Logo",
          sortable: true,
          type: "image",
          formType: "text"
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
      items: state => state.company.items,
      errors: state => state.company.errors
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
      fetchItems: FETCH_COMPANY,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_COMPANY,
      createItem: CREATE_COMPANY,
      deleteItem: DELETE_COMPANY
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
      this.selectedItem = this.fields
        .map(field => {
          return field.key;
        })
        .reduce((p, n) => {
          p[n] = null;
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
