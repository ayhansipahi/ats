<template>
  <div>
    <template v-if="canRead">
      <tprsTable
        v-if="selectedItem === null"
        :items="items"
        :isBusy="fetching"
        :fields="fields"
        :options="options"
        :isCreateVisible="false"
        :canDelete="false"
        :canEdit="false"
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
        :isCreate="isCreate"
        :options="options"
        :canDelete="false"
        :canEdit="false"
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
import { mapActions, mapState, mapGetters } from "vuex";
import tprsTable from "./components/tablo";
import tprsForm from "./components/form";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_ALARM,
  SAVE_ALARM,
  CREATE_ALARM,
  DELETE_ALARM
} from "../../store/modules/alarm";
import permission from "./mixins/permission";
export default {
  name: "alarm",
  components: { tprsTable, tprsForm },
  mixins: [permission],
  data() {
    return {
      title: "Alarm",
      fetching: false,
      fields: [
        {
          key: "AlarmStatus",
          label: "Durum",
          sortable: true,
          type: "text"
        },
        {
          key: "AlarmDetail",
          label: "Detay",
          sortable: true,
          type: "text"
        },
        {
          key: "Plaque",
          label: "Araç Detay",
          sortable: true,
          type: "text"
        },
        {
          key: "AlarmTypeId",
          label: "Tip",
          sortable: true,
          type: "select",
          options: "alarmType",
          optionName: "AlarmDescription",
          formType: "select",
          formatter: (value, key, item) => {
            return this.options["alarmType"].find(
              option => option.Id === item[key]
            );
          },
          filterByFormatted: true
        },
        {
          key: "CreatedDate",
          label: "Oluşturma Tarihi",
          sortable: true,
          type: "datetime"
        }
      ],
      selectedItem: null,
      selectedItemEditable: false,
      isCreate: false
    };
  },
  computed: {
    ...mapState({
      items: state => state.alarm.items,
      errors: state => state.alarm.errors
    }),
    ...mapGetters({
      alarmType: "getAlarmTypes"
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
      fetchItems: FETCH_ALARM,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_ALARM,
      createItem: CREATE_ALARM,
      deleteItem: DELETE_ALARM
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
    await this.fetchOptions();
    await this.fetchItems();
    this.fetching = false;
  }
};
</script>

<style scoped></style>
