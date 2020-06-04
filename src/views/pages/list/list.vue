<template>
  <div>
    <div class="row">
      <div class="col-12 bg-white p-4" v-if="!$route.params.detail">
        <div class="row">
          <div class="col-12" :class="{ 'px-0': insidetable }">
            <table-component
              @formType="form_type = $event"
              @formId="form_id = $event"
              :data="data"
              :form="form"
              :table_content="table"
              :noedit="noedit"
              :title="title"
              :stabile="stabile"
              :api="api"
              :insidetable="insidetable"
            >
            </table-component>
          </div>
        </div>
      </div>

      <transition name="fade" v-if="!noedit">
        <div class="col-12 px-0" id="form_div">
          <form-component
            v-if="form_type !== ''"
            :form="form"
            @formType="form_type = $event"
            :form_type="form_type"
            :form_id="form_id[0]"
            :stabile="stabile"
            :insidetable="insidetable"
            :api="api"
            :canliizle="canliizle"
          >
            <slot></slot>
          </form-component>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import tableComponent from "./table.vue";
import formComponent from "./form.vue";

export default {
  props: [
    "data",
    "form",
    "table",
    "noedit",
    "canliizle",
    "insidetable",
    "title",
    "stabile",
    "api"
  ],
  components: { tableComponent, formComponent },
  data() {
    return {
      form_id: this.$route.params.detail ? this.$route.params.detail : "",
      form_type: this.$route.params.detail ? "edit" : ""
    };
  },
  watch: {
    form_id(val) {
      this.$emit("formId", val[0]);
      let form_data = this.data.find(x => x.id === parseInt(val));
      if (val)
        for (let item in this.form)
          this.form[item].value = form_data[this.form[item].id];
      else for (let item in this.form) this.form[item].value = "";
    },
    form_type(val) {
      if ((val === "" || val === "add") && !this.insidetable)
        document.getElementsByClassName("table_tr").forEach(function(el) {
          el.style.background = "";
        });
    }
  }
};
</script>
