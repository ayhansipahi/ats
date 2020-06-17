<template>
  <div>
    <tprsTable
      :items="items"
      :isBusy="fetching"
      :fields="fields"
      :options="options"
      :editable="false"
      :isCreateVisible="false"
      @onSelect="item => onSelect(item, false)"
      @onFilter="onCancel"
      :canDelete="false"
      :canEdit="false"
    ></tprsTable>
    <tprsForm
      v-if="isCreating"
      :key="selectedItem !== null"
      :item="selectedItem"
      :fields="fields"
      :editable="false"
      :isCreate="false"
      :options="options"
      @onCancel="onCancel"
      :canDelete="false"
      :canEdit="false"
    ></tprsForm>
    <tprsAuth
      v-if="selectedItem !== null && !isCreating"
      :pages="pages"
      :xPages="userPage"
      :key="selectedItem"
      :item.sync="selectedItem"
      :editable="selectedItemEditable"
      :isCreate="isCreating"
      :options="options"
      @onSave="onSaveUserPage"
      @onCancel="onCancel"
      :fields="fields"
      :canDelete="false"
    ></tprsAuth>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import tprsTable from "./components/tablo";
import tprsAuth from "./components/authorization";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_USER } from "../../store/modules/user";
import {
  FETCH_ROLE,
  FETCH_PAGE,
  FETCH_USERPAGE,
  SAVE_USERPAGE
} from "../../store/modules/role";
export default {
  name: "user",
  components: { tprsTable, tprsForm, tprsAuth },
  data() {
    return {
      title: "Kullanıcılar",
      fetching: false,
      fields: [
        {
          key: "UserName",
          label: "Kullanıcı Adı",
          sortable: true,
          type: "text",
          formDisabled: true
        },
        {
          key: "Email",
          label: "Email",
          sortable: true,
          type: "text",
          formDisabled: true
        },
        {
          key: "PhoneNumber",
          label: "Cep Telefonu",
          sortable: true,
          type: "text",
          formDisabled: true
        },
        {
          key: "roles",
          label: "Yetki Grubu",
          sortable: true,
          type: "text",
          options: "role",
          optionName: "Name",
          formType: "select"
        }
      ],
      selectedItem: null,
      selectedItemEditable: false,
      isCreate: false,
      isCreating: false
    };
  },
  computed: {
    ...mapState({
      items: state => state.user.items,
      pages: state => state.role.pages
    }),
    ...mapGetters({
      vehicle: "getVehicles",
      device: "getDevices",
      role: "getRoles",
      userPage:"getUserPages"
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
      fetchItems: FETCH_USER,
      fetchRoles: FETCH_ROLE,
      fetchPages: FETCH_PAGE,
      fetchUserPages: FETCH_USERPAGE,
      saveUserPage: SAVE_USERPAGE,
      setBreadCrumb: SET_BREADCRUMB
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
    },

    onSaveUserPage(role, userPages) {
      Promise.all([
        ...userPages.map(page => this.saveUserPage(page))
      ]).then(responses =>
        responses.map(response => response.IsSuccess).every(res => res === true)
          ? this.reset()
          : false
      );
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
    await this.fetchPages();
    await this.fetchItems();
    await this.fetchUserPages();
    await this.fetchOptions();
    this.fetching = false;
  }
};
</script>

<style scoped></style>
