<template>
  <div>
    <hr class="table-hr" v-if="insidetable" />

    <div class="row" v-if="!insidetable && !stabile">
      <div class="col-4 col-sm-2 col-xl-1" v-if="noedit">
        <div class="mb-4" style="height: 39px"></div>
      </div>
      <div class="col-1 offset-sm-5 offset-xl-7 text-right">
        <button
          class="btn btn-light"
          @click="
            search('all');
            filter = !filter;
          "
        >
          <i
            class="fa fa-filter p-0"
            :class="{ active: filter }"
            id="filter_i"
          ></i>
        </button>
      </div>
      <div class="col-7 col-sm-4 col-xl-3">
        <input
          type="text"
          class="form-control"
          placeholder="Arama..."
          id="search_input_all"
          @keyup="search('all')"
        />
      </div>
      <div class="col-4 col-sm-2 col-xl-1" v-if="!noedit">
        <button
          class="btn btn-primary mb-4 float-right w-100"
          @click="add()"
          v-scroll-to="'#form_div'"
        >
          Yeni +
        </button>
      </div>
    </div>

    <div class="row" v-if="insidetable && !stabile">
      <div class="col-12">
        <h5
          class="mb-4 pl-2"
          :class="{ 'mt-2': form_type !== 'add' }"
          style="color: #737373;font-weight: 600;"
        >
          {{ title }}
          <i
            class="flaticon2-add-1 px-2 pb-2"
            :class="{ 'float-right': form_type !== 'add' }"
            style="color: #797979; cursor: pointer"
            @click="add()"
          ></i>
        </h5>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table" id="table_component">
        <thead class="thead-light">
          <tr>
            <template v-for="(item, key) in thead">
              <th :key="key" scope="col">
                <div @click="sort(key + 1, $event)">{{ item }}</div>
                <input
                  type="text"
                  :id="'search_input_' + key"
                  :search="types[key]"
                  v-if="
                    (types[key] === 'text' ||
                      types[key] === 'number' ||
                      types[key] === 'date' ||
                      types[key] === 'image') &&
                      filter
                  "
                  @keyup="search(key)"
                  :class="{ invisible: types[key] === 'image' }"
                />
                <select
                  v-if="types[key] === 'select' && filter"
                  :id="'search_input_' + key"
                  @change="search(key)"
                  :search="types[key]"
                >
                  <option value=""></option>
                  <template v-for="(item, ins) in fields[key]"
                    ><option :key="ins">{{ item }}</option></template
                  >
                </select>
              </th>
            </template>
            <th :key="i" scope="col" v-if="!noedit">
              <div style="color: transparent">-</div>
              <input type="text" v-if="filter" style="visibility: hidden" />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in tbody">
            <tr :key="index" class="table_tr">
              <template v-for="(value, ind) in item">
                <td
                  :key="ind"
                  v-if="ind !== 0"
                  v-html="
                    $moment(value).unix() > 631152000
                      ? $moment(value).format('DD.MM.YYYY')
                      : valueOrImg(value)
                  "
                ></td>
              </template>
              <td class="text-right" v-if="!noedit">
                <i
                  class="fa fa-trash-alt"
                  :id="'remove_btn_' + item[0]"
                  v-if="!stabile"
                  data-toggle="modal"
                  data-target="#delModal"
                  @click="isRemove(item, index)"
                ></i>
                <i
                  class="fa fa-edit"
                  :id="'edit_btn_' + item[0]"
                  @click="edit(item, index, insidetable)"
                  v-scroll-to="!insidetable ? '#form_div' : ''"
                ></i>
                <i
                  class="fa fa-info-circle"
                  v-if="!insidetable"
                  :id="'info_btn_' + item[0]"
                  @click="info(item, index, insidetable)"
                  v-scroll-to="!insidetable ? '#form_div' : ''"
                ></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      class="modal fade"
      id="delModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="delModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="delModalLabel">Silme İşlemi</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Seçtiğiniz öğeyi silmek istediğinize emin misiniz?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              İptal
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="remove(currentDel)"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "table_content",
    "form",
    "data",
    "noedit",
    "insidetable",
    "title",
    "stabile",
    "api"
  ],
  data() {
    return {
      filter: false,
      selected_bg: "#d6efff",
      thead: [],
      tbody: [],
      types: [],
      fields: [],
      currentDel: false
    };
  },
  computed: {
    table() {
      let thead = [],
        tbody = [],
        types = [],
        fields = [];
      for (let item in this.table_content)
        if (this.table_content[item] !== "id")
          thead.push(
            this.form.find(x => x.id === this.table_content[item]).title
          );
      for (let item in this.table_content)
        if (this.table_content[item] !== "id")
          types.push(
            this.form.find(x => x.id === this.table_content[item]).type
          );
      for (let item in this.table_content)
        if (this.table_content[item] !== "id")
          fields.push(
            this.form.find(x => x.id === this.table_content[item]).fields
          );
      for (let itm in this.data) {
        let row = [];
        for (let item in this.table_content) {
          if (this.table_content[item] !== "id") {
            let val = this.data[itm][this.table_content[item]],
              form = this.form.find(x => x.id === this.table_content[item]),
              type = form.type;
            console.log(this.data);
            if (
              type === "text" ||
              type === "number" ||
              type === "date" ||
              type === "image"
            )
              row.push(val);
            if (type === "select") row.push(form.fields[val]);
          } else row.push(this.data[itm][this.table_content[item]]);
        }
        tbody.push(row);
      }
      return { thead: thead, tbody: tbody, types: types, fields: fields };
    }
  },
  mounted() {
    this.thead = this.table.thead;
    this.tbody = this.table.tbody;
    this.types = this.table.types;
    this.fields = this.table.fields;
  },
  methods: {
    sort: function(index, event) {
      if (document.getElementsByClassName("sort-changed")[0])
        document
          .getElementsByClassName("sort-changed")[0]
          .classList.remove("sort-changed");
      event.target.classList.add("sort-changed");
      event.target.classList.toggle("sorted");
      if (event.target.classList.contains("sorted"))
        this.tbody.sort(function(a, b) {
          if (a[index] < b[index]) return -1;
          if (a[index] > b[index]) return 1;
          return 0;
        });
      else
        this.tbody.sort(function(a, b) {
          if (a[index] > b[index]) return -1;
          if (a[index] < b[index]) return 1;
          return 0;
        });
    },
    search: function(index) {
      var input, filter, table, tr, td, i, txtValue, type;
      input = document.getElementById("search_input_" + index);
      type = input.getAttribute("search");
      filter = input.value.toUpperCase();
      table = document.getElementById("table_component");
      tr = table.getElementsByTagName("tr");

      for (i = 0; i < tr.length; i++) {
        if (index === "all") {
          let tds = tr[i].getElementsByTagName("td"),
            any = 0;
          tds.forEach(function(val, ind) {
            td = tr[i].getElementsByTagName("td")[ind];
            if (td) {
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) any++;
            }
          });
          if (any > 0) tr[i].style.display = "";
          else if (tr[i].parentElement.tagName !== "THEAD")
            tr[i].style.display = "none";
        } else {
          td = tr[i].getElementsByTagName("td")[index];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (type === "number") {
              let numbers = [];
              filter = filter
                .replace("<", " ")
                .replace(",", " ")
                .replace("-", " ")
                .replace(" ", "-")
                .replace(/ /g, "");

              if (filter.includes("-")) numbers = filter.split("-");

              if (numbers[1] > 0) {
                if (
                  parseInt(txtValue) >= parseInt(numbers[0]) &&
                  parseInt(txtValue) <= parseInt(numbers[1])
                )
                  tr[i].style.display = "";
                else tr[i].style.display = "none";
              } else {
                if (filter) {
                  if (parseInt(txtValue) >= parseInt(filter))
                    tr[i].style.display = "";
                  else tr[i].style.display = "none";
                } else {
                  tr[i].style.display = "";
                }
              }
            } else {
              if (txtValue.toUpperCase().indexOf(filter) > -1)
                tr[i].style.display = "";
              else tr[i].style.display = "none";
            }
          }
        }
      }
    },
    select: function(index) {
      if (!this.insidetable) {
        document.getElementsByClassName("table_tr").forEach(function(el) {
          el.style.background = "";
        });
        document.getElementsByClassName("table_tr")[
          index
        ].style.background = this.selected_bg;
      }
    },
    add: function() {
      this.$emit("formId", "");
      this.$emit("formType", "add");
    },
    edit: function(edit_id, index) {
      this.select(index);
      this.$emit("formId", edit_id);
      this.$emit("formType", "edit");
    },
    isRemove: function(item, index) {
      this.edit(item, index);
      this.currentDel = item;
    },
    remove: function(del_id) {
      let s = this;
      this.$axios
        .get(
          "https://tupras-test.azurewebsites.net/api/" +
            s.api +
            "/delete?id=" +
            del_id[0]
        )
        .then(obj => {
          s.$toastr.success("Silme işlemi başarıyla gerçekleşti.");
          s.$store.state.config.key++;
          let el = document.getElementsByClassName("modal-backdrop")[0];
          el.parentNode.removeChild(el);
          console.log(obj);
        });
    },
    info: function(edit_id, index) {
      this.select(index);
      this.$emit("formId", edit_id);
      this.$emit("formType", "info");
    },
    valueOrImg: function(value) {
      if (value) {
        let imgCodw =
          "<img src='" +
          value +
          "' width='auto' max-width='100' height='20' />";
        try {
          if (
            value.includes(".png") ||
            value.includes(".jpg") ||
            value.includes(".jpeg")
          )
            return imgCodw;
          else return value;
        } catch (err) {
          console.log(err);
          return value;
        }
      }
    }
  }
};
</script>
