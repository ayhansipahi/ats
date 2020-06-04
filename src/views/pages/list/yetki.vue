<template>
  <div class="row">
    <div class="col-12">
      <div class="table-responsive">
        <table class="table yetki-table">
          <template v-for="(item, i) in tr">
            <tr :key="i">
              <td v-text="item"></td>
              <template v-for="(value, key) in setting">
                <td :key="key">
                  <input
                    class="form-check-input"
                    :disabled="type === 'info' ? 'disabled' : false"
                    type="checkbox"
                    value=""
                    :id="'id_' + i + key"
                  />
                  <label
                    class="form-check-label"
                    :for="'id_' + i + key"
                    v-text="value"
                  ></label>
                </td>
              </template>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "type"],
  data() {
    return {
      tr: ["Araç", "Firma", "Bakım", "Cihaz"],
      setting: ["Görüntüleme", "Ekleme", "Güncelleme", "Silme"]
    };
  }
};
</script>
