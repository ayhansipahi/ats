<template>
  <div>
    <transition name="fade">
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
    </transition>
    <tprsForm
      v-if="selectedItem !== null"
      :item="selectedItem"
      :fields="fields"
      :editable="false"
      :isCreate="false"
      :options="options"
      @onCancel="onCancel"
      :canDelete="false"
      :canEdit="false"
    ></tprsForm>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_USER } from "../../store/modules/user";
import { FETCH_ROLE } from "../../store/modules/role";
export default {
  name: "user",
  components: { tprsTable, tprsForm },
  data() {
    return {
      title: "Kullanıcılar",
      fetching: false,
      fields: [
        {
          key: "UserName",
          label: "Kullanıcı Adı",
          sortable: true,
          type: "text"
        },
        {
          key: "Email",
          label: "Email",
          sortable: true,
          type: "text"
        },
        {
          key: "PhoneNumber",
          label: "Cep Telefonu",
          sortable: true,
          type: "text"
        },
        {
          key: "roles",
          label: "Yetki Grubu",
          sortable: true,
          type: "text",
        }
      ],
      selectedItem: null,
      selectedItemEditable: false,
      isCreate: false
    };
  },
  computed: {
    ...mapState({
      items: state => state.user.items
    }),
    ...mapGetters({
      vehicle: "getVehicles",
      device: "getDevices"
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
