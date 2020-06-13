<template>
  <div
    class="bg-white"
    :class="{
      'p-4 mt-4': !insidetable && !$route.params.detail,
      'p-4 mt-0': !insidetable && $route.params.detail,
      'px-2 py-0 mt-0 mx-1': insidetable
    }"
  >
    <form
      id="form"
      @change="get_result()"
      @keyup="get_result()"
      @submit="submit()"
    >
      <div class="row">
        <template v-for="(input, key) in form">
          <div :key="key" :class="'form-group col-12 ' + input.cols">
            <input
              class="form-control form-field formElm"
              spellcheck="false"
              autocomplete="no"
              v-if="
                input.type === 'text' ||
                  input.type === 'number' ||
                  input.type === 'date'
              "
              :type="input.type === 'date' ? 'date' : 'text'"
              :typeName="input.type"
              :value="
                input.value
                  ? input.type === 'date'
                    ? $moment(input.value).format('YYYY-MM-DD')
                    : input.value
                  : input.type === 'date' && input.disabled
                  ? $moment(new Date()).format('YYYY-MM-DD')
                  : ''
              "
              :json_key="input.id"
              :placeholder="input.title + ' Giriniz...'"
              :disabled="
                form_type === 'info' || input.disabled ? 'disabled' : false
              "
              required
            />

            <img
              v-if="input.type === 'image'"
              :src="input.value ? input.value : ''"
              class="my-4 mr-4"
              style="width: 100%; max-width: 200px; height: auto"
            />
            <input
              type="file"
              class="formElm"
              v-if="input.type === 'image'"
              typeName="image"
              :json_key="input.id"
              v-show="form_type !== 'info'"
            />

            <select
              class="custom-select form-control formElm"
              v-if="input.type === 'select'"
              typeName="select"
              :value="input.fields[input.value] ? input.value : ''"
              :json_key="input.id"
              :disabled="form_type === 'info' ? 'disabled' : false"
            >
              <option value="" v-text="input.title"></option>
              <template v-for="(text, val) in input.fields">
                <option :key="val" :value="val" v-text="text">Val 1</option>
              </template>
            </select>
          </div>
        </template>
      </div>

      <yetki
        v-if="$route.params.page === 'yetki'"
        :id="form_id"
        :type="form_type"
        :key="form_id"
      ></yetki>

      <div class="row">
        <div class="col-12 text-right form-buttons">
          <i
            class="fa fa-trash-alt text-danger"
            v-if="
              form_type !== 'add' &&
                !insidetable &&
                !$route.params.detail &&
                !stabile
            "
            @click="form_button('remove')"
          ></i>
          <i
            class="fa fa-edit"
            v-if="form_type === 'info' && !insidetable && !$route.params.detail"
            @click="form_button('edit')"
          ></i>
          <i
            class="fa fa-info-circle"
            v-if="form_type === 'edit' && !insidetable && !$route.params.detail"
            @click="form_button('info')"
          ></i>

          <router-link to="/harita/rota" v-if="form_type !== 'add' && canliizle"
            ><button class="btn btn-success mr-3">
              Canlı İzle
            </button></router-link
          >

          <button
            class="btn btn-danger mr-3"
            v-if="!$route.params.detail"
            @click="$emit('formType', '')"
          >
            İptal
          </button>
          <button class="btn btn-primary">Kaydet</button>
        </div>
      </div>
      <slot></slot>
    </form>
  </div>
</template>

<script>
import yetki from "./yetki";

export default {
  components: { yetki },
  props: [
    "form",
    "form_type",
    "form_id",
    "insidetable",
    "canliizle",
    "stabile",
    "api"
  ],
  data() {
    return {
      result: {}
    };
  },
  methods: {
    form_button: function(type) {
      document.getElementById(type + "_btn_" + this.form_id).click();
    },
    get_result: function() {
      let result = {};
      document.getElementsByClassName("formElm").forEach(function(el) {
        let val = el.value;
        if (
          el.getAttribute("typeName") === "number" ||
          el.getAttribute("typeName") === "select"
        )
          val = parseFloat(val);
        result[el.getAttribute("json_key")] = val;
      });
      this.result = result;
    },
    submit: function() {
      this.get_result();

      let result = this.result,
        method = "",
        s = this;

      if (this.form_type === "add") method = "create";
      if (this.form_type === "edit") {
        method = "update";
        result["Id"] = this.form_id;
      }
      delete result["createdDate"];

      this.$axios.post("/api/" + this.api + "/" + method, result).then(() => {
        s.$toastr.success("Form başarıyla kaydedildi.");
        s.$store.state.config.key++;
        let el = document.getElementsByClassName("modal-backdrop")[0];
        el.parentNode.removeChild(el);
      });
    }
  }
};
</script>
