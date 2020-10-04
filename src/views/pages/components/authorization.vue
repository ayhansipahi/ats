<template>
  <div>
    <div class="bg-white p-4">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col v-for="(field, index) in fields" :key="index" md="4">
            <b-form-group v-if="field.formShow !== false || editable">
              <template
                v-if="
                  ['text', 'email', 'number', undefined].includes(
                    field.formType
                  )
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
                  :disabled="field.formDisable || !editable"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t("FORMS.SELECT_DEFAULT", { name: field.label }) }}
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
                  :disabled="field.formDisable || !editable"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }"
                  :locale="currentLang"
                >
                </b-form-datepicker>
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

        <b-row>
          <b-table-simple responsive id="auth-table" striped hover>
            <b-tbody>
              <b-tr v-for="page in pages" :key="page.Id">
                <b-th> {{ $t(`ROLE_PAGE.${page.Id}`) }}</b-th>
                <b-td>
                  <b-form-checkbox
                    :disabled="!editable"
                    v-model="getPageData(page.Id).Read"
                    @change="e => change(e, getPageData(page.Id), 'Read')"
                  >
                    {{ $t("FORMS.PERM_READ") }}
                  </b-form-checkbox>
                </b-td>
                <b-td>
                  <b-form-checkbox
                    :disabled="!editable"
                    v-model="getPageData(page.Id).Write"
                    @change="e => change(e, getPageData(page.Id), 'Write')"
                  >
                    {{ $t("FORMS.PERM_CREATE") }}
                  </b-form-checkbox></b-td
                >
                <b-td>
                  <b-form-checkbox
                    :disabled="!editable"
                    v-model="getPageData(page.Id).Update"
                    @change="e => change(e, getPageData(page.Id), 'Update')"
                  >
                    {{ $t("FORMS.PERM_UPDATE") }}
                  </b-form-checkbox></b-td
                >
                <b-td>
                  <b-form-checkbox
                    :disabled="!editable"
                    v-model="getPageData(page.Id).Delete"
                    @change="e => change(e, getPageData(page.Id), 'Delete')"
                  >
                    {{ $t("FORMS.PERM_DELETE") }}
                  </b-form-checkbox>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-row>

        <b-row align-h="end">
          <template v-if="!isCreate">
            <b-btn v-if="canDelete" variant="ghost" @click="onDelete">
              <b-icon-trash variant="danger"></b-icon-trash>
            </b-btn>
            <b-btn
              variant="ghost"
              v-if="editable"
              @click="editable = !editable"
            >
              <b-icon-info-circle variant="info"></b-icon-info-circle>
            </b-btn>
            <b-btn
              variant="ghost"
              v-if="!editable && canEdit"
              @click="editable = !editable"
            >
              <b-icon-pencil-square variant="primary"></b-icon-pencil-square>
            </b-btn>
          </template>
          <template v-if="editable && canEdit">
            <b-btn variant="danger" @click="onReset">{{
              $t("FORMS.CANCEL")
            }}</b-btn>
            <b-btn variant="primary" type="submit" class="ml-1">{{
              $t("FORMS.SAVE")
            }}</b-btn>
          </template>
          <b-btn v-else variant="primary" @click="onReset" class="ml-1">
            {{ $t("FORMS.CLOSE") }}
          </b-btn>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import i18nService from "../../../common/i18n.service";
export default {
  name: "authorization",
  props: {
    item: { required: true },
    fields: { required: true },
    options: {},
    editable: {
      default: true
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
    pages: {
      default() {
        return [];
      }
    },
    xPages: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      formItem: { ...this.item },
      formXPages: [...this.xPages],
      changeFields: [],
      authRole: []
    };
  },
  computed: {
    currentXPageData() {
      return this.formXPages.filter(rp => {
        return rp.RoleId === this.item.Id || rp.UserId === this.item.Id;
      });
    },
    currentLang() {
      return i18nService.getActiveLanguage();
    }
  },
  methods: {
    getPageData(PageId) {
      return this.currentXPageData.find(p => p.PageId === PageId);
    },
    onSubmit() {
      this.$emit("onSave", this.formItem, this.changeFields);
    },
    onDelete() {
      this.$emit("onDelete", this.formItem);
    },
    onReset() {
      this.formItem = { ...this.item };
      this.$emit("onCancel");
    },
    change(value, xPage, field) {
      let isChange = false;
      this.changeFields.map(cf => {
        if (cf.Id === xPage.Id) {
          isChange = true;
          cf[field] = value;
        }
      });
      if (!isChange) {
        this.changeFields.push(xPage);
      }
    }
  }
};
</script>

<style scoped></style>
