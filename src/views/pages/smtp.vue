<template>
  <div>
    <template v-if="canRead">
      <tprsForm
        :key="item.Id"
        :title="title"
        :item="item"
        :fields="fields"
        :isCreate="false"
        @onSave="onSave"
        :canDelete="false"
        :canBeHidden="false"
        :canEdit="canUpdate"
      ></tprsForm>
    </template>
    <div v-else>
      <b-alert variant="danger" show>
        {{ $t("GENERAL.NO_PERMISSION") }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import tprsForm from "./components/form";
import { mapActions, mapState } from "vuex";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_SMTP, SAVE_SMTP } from "../../store/modules/smtp";
import permission from "./mixins/permission";

export default {
  name: "smtp",
  components: { tprsForm },
  mixins: [permission],
  data() {
    return {
      fetching: false,
      method: "",
      checkedStatus: false,
      selectedItem: null,
      selectedItemEditable: false,
      isCreating: false
    };
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_SMTP,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_SMTP
    }),
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
            ? this.$toastr.success(this.$t("MESSAGES.SUCCESS"))
            : this.$toastr.error(data.Message);
        })
        .catch(err => {
          if (typeof this.errors === "object") {
            Object.keys(this.errors).forEach(key => {
              const errorTitle = this.fields.find(field => field.key === key)
                .label;
              const errorText = this.errors[key];
              this.$toastr.error(`<b>${errorTitle}</b> <br/>${errorText}`);
            });
          } else {
            this.$toastr.error(err.message);
          }
        });
    }
  },
  computed: {
    title() {
      return this.$t("TITLE.smtp");
    },
    fields() {
      return [
        {
          key: "Email",
          label: this.$t("FIELDS.smtp.Email"),
          sortable: true,
          type: "email",
          formType: "email",
          required: true
        },
        {
          key: "Password",
          label: this.$t("FIELDS.smtp.Password"),
          sortable: true,
          type: "password",
          required: true,
          formType: "password"
        },

        {
          key: "Host",
          label: this.$t("FIELDS.smtp.Host"),
          sortable: true,
          type: "text",
          required: true
        },
        {
          key: "Port",
          label: this.$t("FIELDS.smtp.Port"),
          sortable: true,
          type: "number",
          required: true,
          formType: "number"
        },
        {
          key: "EnableSsl",
          label: this.$t("FIELDS.smtp.EnableSsl"),
          value: false,
          type: "boolean",
          formType: "checkbox"
        }
      ];
    },
    ...mapState({
      item: state => state.smtp.item
    })
  },

  async mounted() {
    this.setBreadCrumb([
      {
        title: this.title,
        route: this.$router.route
      }
    ]);
    this.fetchItems();
  }
};
</script>

<style scoped></style>
