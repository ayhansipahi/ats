<template>
  <div>
    <transition name="fade">
      <b-form v-if="false" @submit.prevent="onSubmit">
        <b-row>
          <b-col>
            <h3>{{ title }}</h3>
          </b-col>
        </b-row>
        <b-row>
          <b-col v-for="(field, index) in fields" :key="index" md="4">
            <b-form-group>
              <template>
                <b-form-checkbox
                  v-if="field.key === 'EnableSsl'"
                  id="checkbox-1"
                  name="checkbox-1"
                  v-model="item[0][field.key]"
                  :value="item.length > 0 ? item[0][field.key] : false"
                >
                  SMTP güvenli bağlantı ile mi çalışıyor (SSL)
                </b-form-checkbox>
                <b-form-input
                  v-else
                  :type="field.type"
                  :required="field.required"
                  :placeholder="field.label"
                  :value="item.length > 0 ? item[0][field.key] : ''"
                ></b-form-input>
              </template>
            </b-form-group>
          </b-col>
          <b-col> </b-col>
        </b-row>
        <template>
          <b-btn variant="primary" type="submit" class="ml-1"
            >{{ method === "CREATE_SMTP" ? "Kaydet" : "Güncelle" }}
          </b-btn>
        </template>
      </b-form>
    </transition>

    <tprsForm
            :key="item.Id"
      :title="title"
      :item="item"
      :fields="fields"
      :isCreate="false"
      @onSave="onSave"
      :canDelete="false"
      :canBeHidden="false"
    ></tprsForm>
  </div>
</template>

<script>
import tprsForm from "./components/form";
import { mapActions, mapState } from "vuex";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import {
  FETCH_SMTP,
  SAVE_SMTP
} from "../../store/modules/smtp";

export default {
  name: "smtp",
  components: { tprsForm },
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
      isCreate: false
    };
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_SMTP,
      setBreadCrumb: SET_BREADCRUMB,
      saveItem: SAVE_SMTP
    }),
    onSave(item) {
      debugger;
      this.saveItem(item).then(data => {
        if (data.IsSuccess) this.$toastr.success("başarılı");
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
