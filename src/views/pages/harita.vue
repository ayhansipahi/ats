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
              :center="maplatlng"
              :zoom="zoom"
              map-type-id="terrain"
              style="width: 100%; height: 500px"
              :options="mapOptions"
            >
              <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center = m.position"
              />
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

<style>
.kt-sticky-toolbar {
  display: none;
}
.car-info {
  font-size: 16px;
}
.car-info-title {
  background: #cbd3d5;
  color: #545454;
}
.car-info-val {
  background: #ececec;
  color: #252525;
}
</style>

<script>
import { SET_BREADCRUMB } from "@/store/breadcrumbs.module";

export default {
  data() {
    return {
      type: this.$route.params.type,
      zoom: 10,
      maplatlng: { lat: 41.00527, lng: 28.97696 },
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      markers: [
        { position: { lat: 41.00527, lng: 28.97696 } },
        { position: { lat: 41.099052, lng: 28.9087693 } },
        { position: { lat: 41.104387, lng: 29.039742 } },
        { position: { lat: 41.079611, lng: 29.114142 } },
        { position: { lat: 41.145769, lng: 29.099435 } },
        { position: { lat: 41.170334, lng: 29.020496 } },
        { position: { lat: 41.141696, lng: 28.764939 } },
        { position: { lat: 41.027018, lng: 28.706696 } },
        { position: { lat: 41.2383, lng: 28.914707 } },
        { position: { lat: 41.363761, lng: 28.474913 } },
        { position: { lat: 41.261089, lng: 28.335843 } },
        { position: { lat: 41.181518, lng: 28.226488 } },
        { position: { lat: 41.134982, lng: 29.324786 } },
        { position: { lat: 41.04988, lng: 29.308145 } },
        { position: { lat: 41.018118, lng: 29.250483 } },
        { position: { lat: 40.952769, lng: 29.164641 } },
        { position: { lat: 40.764598, lng: 29.376336 } },
        { position: { lat: 41.064756, lng: 29.602581 } },
        { position: { lat: 41.134926, lng: 29.489822 } },
        { position: { lat: 41.248616, lng: 28.599429 } },
        { position: { lat: 41.175726, lng: 28.505131 } },
        { position: { lat: 41.16205, lng: 28.627113 } },
        { position: { lat: 41.121005, lng: 28.456684 } }
      ]
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Araç", route: "#" },
      { title: "Harita" }
    ]);
    document.getElementById(this.type).checked = true;
  },
  methods: {
    radioChange: function() {
      document.getElementsByClassName("map_type").forEach(function(el) {
        if (el.checked) document.location.href = "/#/harita/" + el.value;
      });
    }
  }
};
</script>
