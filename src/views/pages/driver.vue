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
        You don't have permission to see this page
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
      title: "Şoför",
      fetching: false,
      fields: [
        {
          key: "TCKN",
          label: "TC",
          sortable: true,
          type: "text"
        },
        {
          key: "DriverName",
          label: "Adı",
          sortable: true,
          type: "text",
          formRequired: true
        },
        {
          key: "Phone",
          label: "Telefon",
          sortable: true,
          type: "text"
        },
        {
          key: "Email",
          label: "E-Posta",
          sortable: true,
          type: "text",
          formType: "email"
        },
        {
          key: "Address",
          label: "Adres",
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
        .msgBoxConfirm(this.title + " silinsin mi?", {
          okTitle: "Evet",
          cancelTitle: "Hayır"
        })
        .then(value => (value ? this.deleteItem(item) : false))
        .then(() => (this.selectedItem = null));
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
