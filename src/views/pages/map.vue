<template>
  <div>
    <div class="row">
      <div class="col-12 bg-white p-4">
        <div class="row">
          <div class="form-group col-12 mb-4 ml-1">
            <div class="form-check d-inline">
              <input
                class="form-check-input map_type"
                type="radio"
                name="map_type"
                @change="radioChange()"
                id="konum"
                value="konum"
              />
              <label class="form-check-label ml-2" for="konum">Konum</label>
            </div>
            <div class="form-check d-inline ml-3">
              <input
                class="form-check-input map_type"
                type="radio"
                name="map_type"
                @change="radioChange()"
                id="rota"
                value="rota"
              />
              <label class="form-check-label ml-2" for="rota">Rota</label>
            </div>
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3">
            <select class="custom-select form-control">
              <option value="" selected="">Firma</option>
              <option value="">A Firması</option>
              <option value="">B Firması</option>
              <option value="">C Firması</option>
            </select>
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3">
            <select class="custom-select form-control">
              <option value="">Araç</option>
              <option value="">34 XYZ 1000</option>
              <option value="">34 ABC 2000</option>
              <option value="">34 QWE 3000</option>
            </select>
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3">
            <input type="date" class="form-control" />
          </div>

          <div class="form-group col-12 col-sm-6 col-md-3">
            <input type="date" class="form-control" />
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-8 col-xl-9 order-1 order-md-0">
            <GmapMap
              map-type-id="terrain"
              style="width: 100%; height: 500px"
              :options="mapOptions"
            >
              <!-- <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center = m.position"
              /> -->
            </GmapMap>
          </div>
          <div class="col-12 col-md-4 col-xl-3 px-4 mb-4 order-0 order-md-1">
            <div class="row car-info">
              <div class="col-12 px-3 py-2 car-info-title">
                <strong><i class="fa fa-car-alt mr-2"></i> Plaka :</strong>
              </div>
              <div class="col-12 pr-3 py-2 pl-5 mb-3 car-info-val">
                34 XYZ 1000
              </div>

              <div class="col-12 px-3 py-2 car-info-title">
                <strong><i class="fa fa-tachometer-alt mr-2"></i> Hız :</strong>
              </div>
              <div class="col-12 pr-3 py-2 pl-5 mb-3 car-info-val">70 km/s</div>

              <div class="col-12 px-3 py-2 car-info-title">
                <strong
                  ><i class="fa fa-map-marker-alt mr-2"></i> Son Bekleme
                  :</strong
                >
              </div>
              <div class="col-12 pr-3 py-2 pl-5 car-info-val">
                36,4585 : 43,5596
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "map",
  data() {
    return {
      mapOptions: {}
    };
  },
  methods: {
    radioChange() {}
  }
};
</script>

<style scoped></style>
