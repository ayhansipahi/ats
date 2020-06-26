<template>
  <div class="bg-white p-4 mb-4">
    <b-row align-h="end">
      <b-col cols="8" sm="7" md="6" lg="5">
        <b-input placeholder="Arama..." @input="filterAll" ref="filterInput" />
      </b-col>
      <b-col cols="4" sm="3" md="2" lg="2" v-if="isCreateVisible">
        <b-btn class="col-12" variant="primary" @click="$emit('onNew')">
          <b-icon-plus></b-icon-plus> Yeni
        </b-btn>
      </b-col>
    </b-row>
<div v-if="this.items.length > 0">
    <b-table
      :responsive="true"
      id="my-table"
      :filter="filter"
      :filter-included-fields="filterIncludedFields"
      :busy.sync="isBusy"
      :items="items"
      :fields="_fields"
      striped
      hover
    >
  
      <template v-slot:top-row="data">
        <b-td :key="field.key" v-for="field in data.fields">
          <b-input
            v-if="field.key !== 'actions'"
            @input="e => filterScoped(e, field.key)"
            :placeholder="`Filtrele (${field.label})`"
            ref="scopedFilterInput"
            :scope="field.key"
          >
          </b-input>
        </b-td>
      </template>
      <template v-slot:cell(actions)="row">
        <b-btn-group>
          <b-btn v-if="canDelete" variant="ghost" @click="onDelete(row.item)">
            <b-icon-trash variant="danger"></b-icon-trash>
          </b-btn>
          <b-btn variant="ghost" @click="onSelect(row.item)">
            <b-icon-info-circle variant="info"></b-icon-info-circle>
          </b-btn>
          <b-btn v-if="canEdit" variant="ghost" @click="onEdit(row.item)">
            <b-icon-pencil-square variant="primary"></b-icon-pencil-square>
          </b-btn>
        </b-btn-group>
      </template>
      <template v-for="field in fields" v-slot:[`cell(${field.key})`]="row">
        <template v-if="row.field.type === 'select'">
          {{
            options[field.options].find(
              option => option.Id === row.item[field.key]
            )[field.optionName]
          }}
        </template>
        <template v-if="row.field.type === 'multiselect'">
          {{
            options[field.options]
              .filter(option => {
                return row.item[field.key].includes(option.Id);
              })
              .map(option => option[field.optionName])
              .join(", ")
          }}
        </template>

        <template v-else-if="row.field.type === 'datetime'">
          {{ $moment(row.item[field.key]).format("DD.MM.YYYY") }}
        </template>
        <template v-else-if="row.field.type === 'image'">
          <b-img
            :key="field.key"
            :src="row.item[field.key]"
            height="38"
          ></b-img>
        </template>
        <template v-else>{{ row.item[field.key] }}</template>
      </template>
    </b-table>
      </div>
  </div>

</template>

<script>
export default {
  name: "TprsTable",
  props: {
    items: {
      required: true
    },
    fields: { required: true },
    isBusy: {
      default: false
    },
    editable: {
      default: false
    },
    isCreateVisible: {
      default: false
    },
    isActionsVisible: {
      default: true
    },
    options: {
      default() {
        return {};
      }
    },
    canDelete: {
      default: true
    },
    canEdit: {
      default: true
    }
  },
  computed: {
    _fields() {
      return this.isActionsVisible
        ? [...this.fields, "actions"]
        : [...this.fields];
    }
  },
  data() {
    return {
      filter: null,
      filterIncludedFields: []
    };
  },
  mounted() {
    console.log(this.items);
  },
  created() {
    console.log(this.items);
  },
  methods: {
    filterAll(e) {
      this.$refs.scopedFilterInput.forEach(_ => {
        _.localValue = "";
      });
      this.filter = e;
      this.filterIncludedFields = [];
      this.onFilter();
    },
    filterScoped(e, scope) {
      this.$refs.scopedFilterInput.forEach(_ => {
        if (_.$attrs.scope !== scope) {
          _.localValue = "";
        }
      });
      this.$refs.filterInput.localValue = "";
      this.filter = e;
      this.filterIncludedFields = [scope];
      this.onFilter();
    },
    onDelete(data) {
      this.canDelete && this.$emit("onDelete", data);
    },
    onEdit(data) {
      this.canEdit && this.$emit("onEdit", data);
    },
    onSelect(data) {
      this.$emit("onSelect", data);
    },
    onFilter() {
      this.$emit("onFilter");
    }
  }
};
</script>

<style scoped></style>
