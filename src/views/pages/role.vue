<template>
  <div>
    <transition name="fade">
      <tprsTable
        :items="roles"
        :isBusy="fetching"
        :fields="fields"
        options="options"
        :editable="false"
        :isCreateVisible="true"
        @onSelect="item => onSelect(item, false)"
        @onDelete="onDelete"
        @onEdit="item => onSelect(item, true)"
        @onFilter="onCancel"
        @onNew="onNew"
        :canDelete="true"
        :canEdit="true"
      ></tprsTable>
    </transition>
    <tprsForm
      :key="selectedItem.Id"
      v-if="isCreating"
      :item="selectedItem"
      :fields="fields"
      :editable="selectedItemEditable"
      :isCreate="isCreating"
      @onSave="onCreateRole"
      @onCancel="onCancel"
      @onDelete="onDelete"
    ></tprsForm>
    <tprsAuth
      :key="'a_' + selectedItem.Id"
      v-if="selectedItem !== null && !isCreating"
      :pages="pages"
      :xPages="rolePages"
      :item.sync="selectedItem"
      :editable="selectedItemEditable"
      :isCreate="isCreating"
      @onSave="onSaveRolePage"
      @onCancel="onCancel"
      :fields="fields"
      :canDelete="false"
    ></tprsAuth>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  FETCH_ROLE,
  FETCH_PAGE,
  FETCH_ROLEPAGE,
  FETCH_ROLEPAGEBYROLE,
  SAVE_ROLE,
  CREATE_ROLE,
  SAVE_ROLEPAGE,
  DELETE_ROLE
} from "../../store/modules/role";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import tprsAuth from "./components/authorization";
export default {
  name: "role",
  components: { tprsTable, tprsAuth, tprsForm },
  data() {
    return {
      title: "Rol",
      fields: [
        {
          key: "Name",
          label: "Rol Adı",
          sortable: true,
          type: "text"
        }
      ],
      fetching: false,
      selectedItem: null,
      selectedItemEditable: false,
      isCreate: false,
      isCreating: false
    };
  },
  computed: {
    ...mapState({
      roles: state => state.role.roles,
      pages: state => state.role.pages,
      rolePages: state => state.role.rolePages
    })
  },
  methods: {
    ...mapActions({
      fetchRoles: FETCH_ROLE,
      fetchPages: FETCH_PAGE,
      fetchRolePages: FETCH_ROLEPAGE,
      fetchRolePageByRole: FETCH_ROLEPAGEBYROLE,
      saveRole: SAVE_ROLE,
      createRole: CREATE_ROLE,
      saveRolePage: SAVE_ROLEPAGE,
      setBreadCrumb: SET_BREADCRUMB,
      deleteItem: DELETE_ROLE,
    }),
    onSelect(item, editable) {
      this.selectedItem = item;
      this.selectedItemEditable = editable;
      this.fetchRolePageByRole(item.Id);
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
    onCreateRole(item) {
      this.createRole(item).then(data =>
        data.IsSuccess ? this.reset() : false
      );
    },
    onSaveRolePage(role, rolePages) {
      Promise.all([
        this.saveRole(role),
        ...rolePages.map(rolePage => this.saveRolePage(rolePage))
      ]).then(responses =>
        responses.map(response => response.IsSuccess).every(res => res === true)
          ? this.reset()
          : false
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
    await this.fetchPages();
    await this.fetchRoles();
    await this.fetchRolePages();
    this.fetching = false;
  }
};
</script>

<style scoped></style>
