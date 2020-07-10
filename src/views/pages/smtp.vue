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
        You don't have permission to see this page
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
      title: "Smtp",
      fetching: false,
      method: "",
      checkedStatus: false,
      fields: [
        {
          key: "Email",
          label: "Smtp E-posta",
          sortable: true,
          type: "email",
          formType: "email",
          required: true
        },
        {
          key: "Password",
          label: "Parola",
          sortable: true,
          type: "password",
          required: true,
          formType: "password"
        },

        {
          key: "Host",
          label: "Smtp Host",
          sortable: true,
          type: "text",
          required: true
        },
        {
          key: "Port",
          label: "Smtp Port",
          sortable: true,
          type: "number",
          required: true,
          formType: "number"
        },
        {
          key: "EnableSsl",
          value: false,
          label: "SMTP güvenli bağlantı ile mi çalışıyor (SSL)",
          type: "boolean",
          formType: "checkbox"
        }
      ],
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
            ? this.$toastr.success("İşlem Başarılı")
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
