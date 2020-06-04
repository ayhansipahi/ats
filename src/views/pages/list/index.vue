<template>
  <list
    :data="data"
    :form="form"
    :table="table"
    canliizle="page.canliizle"
    :noedit="false"
    stabile="page.stabile"
    api="page.api"
    formId="page.form_id = $event"
  >
    <in-list
      v-if="false"
      inData="page.inList"
      data="page.data"
      form_id="page.form_id"
    ></in-list>
  </list>
</template>
<script>
import list from "./list.vue";
import inList from "./in-list.vue";
export default {
  components: { list, inList },
  props: ["data", "form", "table"]
};
</script>
