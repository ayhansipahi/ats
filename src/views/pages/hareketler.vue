<template>
  <div>
    <div class="row">
      <div class="col-12 bg-white px-4 pt-4 pb-0 mb-4">
        <div class="row">
          <div class="form-group col-12 col-sm-6 col-md-3 mb-4">
            <select class="custom-select form-control">
              <option value="" selected="">Firma</option>
              <option value="">A Firması</option>
              <option value="">B Firması</option>
              <option value="">C Firması</option>
            </select>
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3 mb-4">
            <select class="custom-select form-control">
              <option value="">Araç</option>
              <option value="">34 XYZ 1000</option>
              <option value="">34 ABC 2000</option>
              <option value="">34 QWE 3000</option>
            </select>
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3 col-lg-2 mb-4">
            <input type="date" class="form-control" />
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3 col-lg-2 mb-4">
            <input type="date" class="form-control" />
          </div>

          <div class="form-group col-12 col-lg-2 mb-4">
            <button class="btn btn-primary w-100" @click="getList()">
              Ara
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="page">
      <div class="col-12 bg-white p-4">
        <list :page="page"></list>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";
import pages from "./data.json";
import list from "./list/index.vue";

export default {
  components: { list },
  data() {
    return {
      page: false
    };
  },
  methods: {
    getList() {
      this.page = pages["hareketler"];
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Araç", route: "#" },
      { title: "Araç Hareketleri Listesi" }
    ]);
  }
};
</script>
