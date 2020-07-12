<template>
  <div class="bg-white p-4">
    <b-form @submit.prevent="onSubmit">
      <b-row>
        <b-col>
          <h3>{{ title }} {{ isCreate ? "Oluştur" : "Detayı" }}</h3>
        </b-col>
      </b-row>
      <b-row>
        <template v-for="(field, index) in fields">
          <b-col :key="index" md="4" v-if="fieldVisible(field)">
            <b-form-group>
              <template
                v-if="
                  ['text', 'email', 'number', 'password', undefined].includes(
                    field.formType
                  )
                "
              >
                <b-form-input
                  v-model="formItem[field.key]"
                  :type="field.formType"
                  :required="field.formRequired"
                  :placeholder="field.label"
                  :disabled="field.formDisable || !selfEditable"
                  v-mask="
                    field.mask ||
                      'X?XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                  "
                >
                </b-form-input>
              </template>
              <template v-if="['select'].includes(field.formType)">
                <b-form-select
                  v-model="formItem[field.key]"
                  :required="field.formRequired"
                  :placeholder="field.label"
                  :disabled="field.formDisable || !selfEditable"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>
                      Bir {{ field.label }} seçin
                    </b-form-select-option>
                  </template>
                  <b-form-select-option
                    :key="option.Id"
                    v-for="option in options[field.options]"
                    :value="option.Id"
                  >
                    {{ option[field.optionName] }}
                  </b-form-select-option>
                </b-form-select>
              </template>

              <template v-if="['multiselect'].includes(field.formType)">
                <b-form-select
                  multiple
                  :select-size="options[field.options].length + 1"
                  v-model="formItem[field.key]"
                  :required="field.formRequired"
                  :placeholder="field.label"
                  :disabled="field.formDisable || !selfEditable"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>
                      Bir {{ field.label }} seçin
                    </b-form-select-option>
                  </template>
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
                  :disabled="field.formDisable || !selfEditable"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }"
                  locale="tr"
                >
                </b-form-datepicker>
              </template>
              <template v-if="['file'].includes(field.formType)">
                <b-form-file
                  v-model="formItem[field.key]"
                  :type="field.formType"
                  :required="field.formRequired"
                  :placeholder="field.label"
                  :disabled="field.formDisable || !selfEditable"
                ></b-form-file>
              </template>

              <template v-if="['checkbox'].includes(field.formType)">
                <b-form-checkbox
                  v-model="formItem[field.key]"
                  :disabled="field.formDisable || !selfEditable"
                  >{{ field.label }}
                </b-form-checkbox>
              </template>
            </b-form-group>
          </b-col>
        </template>
      </b-row>
      <b-row align-h="end">
        <template v-if="!isCreate">
          <b-btn
            v-if="isVehicle"
            variant="success"
            @click="
              $router.push({
                path: `/map/${item.CompanyId}/${item.Id}/location`
              })
            "
          >
            <b-icon-eye-fill />
            Canlı İzle
          </b-btn>
          <b-btn v-if="canDelete" variant="ghost" @click="onDelete">
            <b-icon-trash variant="danger"></b-icon-trash>
          </b-btn>
          <b-btn
            variant="ghost"
            v-if="selfEditable"
            @click="selfEditable = !selfEditable"
          >
            <b-icon-info-circle variant="info"></b-icon-info-circle>
          </b-btn>
          <b-btn
            variant="ghost"
            v-if="!selfEditable && canEdit"
            @click="selfEditable = !selfEditable"
          >
            <b-icon-pencil-square variant="primary"></b-icon-pencil-square>
          </b-btn>
        </template>
        <template v-if="selfEditable && canEdit">
          <b-btn variant="danger" v-if="canBeHidden" @click="onReset"
            >İptal</b-btn
          >
          <b-btn variant="primary" type="submit" class="ml-1">Kaydet</b-btn>
        </template>
        <template v-else>
          <b-btn
            v-if="canBeHidden"
            variant="primary"
            @click="onReset"
            class="ml-1"
          >
            Kapat
          </b-btn>
        </template>
      </b-row>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "tprsForm",
  props: {
    title: { default: "" },
    item: { required: true },
    fields: { required: true },
    options: {},
    editable: {
      default: false
    },
    isCreate: {
      default: false
    },
    isVehicle: { default: false },
    canDelete: {
      default: true
    },
    canEdit: {
      default: true
    },
    canBeHidden: {
      default: true
    }
  },
  data() {
    return {
      formItem: { ...this.item },
      selfEditable: this.editable
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
    },
    fieldVisible(field) {
      if (this.isCreate && field.formHide) return false;
      if (this.selfEditable && field.formHide) return false;
      return true;
    },
    getMask(mask = null) {
      if (mask === null) {
        return "X?";
      } else {
        return mask;
      }
    }
  }
};
</script>

<style scoped>
[type="number"] {
  width: 100%;
}
</style>
