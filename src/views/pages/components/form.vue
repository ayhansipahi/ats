<template>
  <div class="bg-white p-4">
    <b-form @submit="onSubmit">
      <b-row>
        <b-col v-for="(field, index) in fields" :key="index" md="4">
          <b-form-group v-if="field.formShow !== false || editable">
            <template
              v-if="
                ['text', 'email', 'number', undefined].includes(field.formType)
              "
            >
              <b-form-input
                v-model="formItem[field.key]"
                :type="field.formType"
                :required="field.formRequired"
                :placeholder="field.label"
                :disabled="field.formDisable || !editable"
              ></b-form-input>
            </template>
            <template v-if="['select'].includes(field.formType)">
              <b-form-select
                v-model="formItem[field.key]"
                :required="field.formRequired"
                :placeholder="field.label"
                :disabled="field.formDisable || !editable"
              >
                <b-form-select-option :value="null"
                  >Bir {{ field.label }} seçin</b-form-select-option
                >
                <b-form-select-option
                  :key="option.Id"
                  v-for="option in options[field.options]"
                  :value="option.Id"
                >
                  {{ option[field.optionName] }}
                </b-form-select-option>
              </b-form-select>
            </template>

            <template v-if="['datetime'].includes(field.formType)">
              <b-form-datepicker
                v-model="formItem[field.key]"
                :required="field.formRequired"
                :placeholder="field.label"
                :disabled="field.formDisable || !editable"
                locale="tr-TR"
              ></b-form-datepicker>
            </template>
            <template v-if="['file'].includes(field.formType)">
              <b-form-file
                v-model="formItem[field.key]"
                :type="field.formType"
                :required="field.formRequired"
                :placeholder="field.label"
                :disabled="field.formDisable || !editable"
              ></b-form-file>
            </template>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <template v-if="!isCreate">
          <b-btn variant="ghost" @click="onDelete">
            <b-icon-trash variant="danger"></b-icon-trash>
          </b-btn>
          <b-btn variant="ghost" v-if="editable" @click="editable = !editable">
            <b-icon-info-circle variant="info"></b-icon-info-circle>
          </b-btn>
          <b-btn variant="ghost" v-if="!editable" @click="editable = !editable">
            <b-icon-pencil-square variant="primary"></b-icon-pencil-square>
          </b-btn>
        </template>
        <template v-if="editable">
          <b-btn variant="danger" @click="onReset">İptal</b-btn>
          <b-btn variant="primary" type="submit" class="ml-1">Kaydet</b-btn>
        </template>
        <b-btn v-else variant="primary" @click="onReset" class="ml-1">
          Kapat
        </b-btn>
      </b-row>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "tprsForm",
  props: {
    item: { required: true },
    fields: { required: true },
    options: {},
    editable: {
      default: true
    },
    isCreate: {
      default: false
    }
  },
  data() {
    return {
      formItem: { ...this.item }
    };
  },
  methods: {
    onSubmit() {
      this.$emit("onSave", this.formItem);
    },
    onDelete() {
      this.$emit("onDelete", this.formItem);
    },
    onReset() {
      this.formItem = { ...this.item };
      this.$emit("onCancel");
    }
  }
};
</script>

<style scoped>
[type="number"] {
  width: 100%;
}
</style>
