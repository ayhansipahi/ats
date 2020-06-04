<template>
  <transition name="fade">
    <list :page="page" v-if="load"></list>
    <div class="lds-dual-ring mt-5 d-flex mx-auto" v-if="!load"></div>
  </transition>
</template>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";
import list from "./list/index.vue";

export default {
  components: { list },
  data() {
    return {
      load: false,
      page: {}
    };
  },
  methods: {
    breadcrumb: function() {
      this.$store.dispatch(SET_BREADCRUMB, [
        {
          title: this.page.title,
          route: "#"
        },
        {
          title: this.page.childTitle
            ? this.page.childTitle
            : this.page.title + " Listesi"
        }
      ]);
    },
    idLow: function(data) {
      let newData = [];
      for (let item in data) {
        if (data[item].hasOwnProperty("Id")) {
          let other = data[item];
          data[item] = {};
          data[item]["id"] = other["Id"];
          data[item] = { ...data[item], ...other };
          delete data[item]["Id"];
        }
        newData.push(data[item]);
      }
      return newData;
    },
    pagefunc: function(preData, data, api) {
      let form = {},
        table = {},
        tableArr = [],
        preArr = preData[1],
        formArr = [];
      form["title"] = preData[0];
      for (let item in preArr) {
        let itemPre = preArr[item],
          i = parseInt(itemPre[4]);
        if (i > 0) table[i] = itemPre[0];
      }
      tableArr = ["id"];
      let tabArr = Object.values(table);
      for (let item in tabArr) tableArr.push(tabArr[item]);
      form["table"] = tableArr;
      form["api"] = api;

      for (let item in preArr) {
        let itemPre = preArr[item],
          itemObj = {};
        itemObj["id"] = itemPre[0];
        itemObj["title"] = itemPre[1];
        itemObj["type"] = itemPre[2];
        itemObj["cols"] = itemPre[3];
        itemPre[2] === "select" ? (itemObj["fields"] = itemPre[5]) : 0;
        itemPre[2] === "disabled" ? (itemObj["disabled"] = true) : 0;
        itemPre[2] === "disabled" ? (itemObj["type"] = "date") : 0;
        itemPre[7] ? (itemObj["stabile"] = itemPre[7]) : 0;
        formArr.push(itemObj);
      }
      form["form"] = formArr;
      form["form_id"] = 0;
      form["data"] = data;
      this.page = form;
      this.breadcrumb();
    }
  },
  mounted() {
    require("./api/" + this.$route.params.page + ".js")(this);
  }
};
</script>
