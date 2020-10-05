<template>
  <div id="viewer" ref="viewer" data-bind="dxReportViewer: $data"></div>
</template>

<script>
import "jquery-ui/themes/base/all.css";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.light.css";
import "@devexpress/analytics-core/dist/css/dx-querybuilder.css";
import "devexpress-reporting/dist/css/dx-webdocumentviewer.css";
import "devexpress-reporting/dist/css/dx-reportdesigner.css";

import ko from "knockout";
import "devexpress-reporting/dx-webdocumentviewer";

import { BASE_URL } from "@/common/config";

export default {
  name: "reportView",
  props: {
    report: {
      required: true,
      type: Object
    }
  },
  methods: {
    viewReport() {
      var viewerOptions = {
        reportUrl: ko.observable(this.report.ReportValue), // The URL of a report.
        requestOptions: {
          host: BASE_URL,
          // Use this line if you use an ASP.NET MVC backend
          //invokeAction: "/WebDocumentViewer/Invoke"
          // Uncomment this line if you use an ASP.NET Core backend
          invokeAction: "DXXRDV"
        }
      };
      ko.applyBindings(viewerOptions, this.$refs.viewer);
    }
  },
  mounted() {
    this.viewReport();
  },
  beforeDestroy() {
    ko.cleanNode(this.$refs.viewer);
  }
};
</script>

<style scoped>
#viewer {
  height: calc(100vh - 320px);
}
</style>
