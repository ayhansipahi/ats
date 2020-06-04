<template>
  <div>
    <list
      :key="form_id"
      :data="child"
      :form="inData.form"
      :table="inData.table"
      :noedit="inData.noedit"
      :insidetable="true"
      :title="inData.title"
    ></list>
  </div>
</template>
<script>
import list from "./list.vue";

export default {
  components: { list },
  props: ["inData", "data", "form_id"],
  computed: {
    child() {
      try {
        return this.data.find(x => x.id === parseInt(this.form_id)).child;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
