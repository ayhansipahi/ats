import { mapGetters } from "vuex";

export default {
  data() {
    return {
      canWrite: false,
      canRead: false,
      canUpdate: false,
      canDelete: false
    };
  },
  computed: {
    ...mapGetters(["getPageByPath", "getPermissionsByPage"])
  },
  created() {
    const page = this.getPageByPath(this.$route.path.replace(/\//g, ""));
    if (typeof page.Id === "undefined") return;
    const permissions = this.getPermissionsByPage(page.Id);
    this.canWrite = permissions.write;
    this.canRead = permissions.read;
    this.canUpdate = permissions.update;
    this.canDelete = permissions.delete;
  }
};
