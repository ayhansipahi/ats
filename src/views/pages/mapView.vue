<template>
  <div>
    <b-row>
      <b-modal
        id="modal-center"
        size="xl"
        centered
        hide-header
        static
        @ok="onManuelSelect"
      >
        <GmapMap
          :center="mapCenter"
          :zoom="mapZoom"
          map-type-id="terrain"
          style="width: 100%; height: 500px"
          :options="mapOptions"
          ref="drawMapRef"
        />
      </b-modal>
    </b-row>
    <b-row>
      <b-col class="col-12 bg-white p-4">
        <b-form class="row">
          <b-col md="2" cols="12">
            <b-form-select
              v-model="formCompany"
              @change="onCompanySelect"
              :options="formCompanyOptions"
              required
            >
              <template v-slot:first>
                <b-form-select-option :value="null">
                  Bir Firma seçin
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-col>
          <b-col md="2" cols="12">
            <b-form-select
              v-model="formVehicle"
              :options="formVehicleOptions"
              @change="onVehicleSelect"
            >
              <template v-slot:first>
                <b-form-select-option :value="null">
                  Bir Araç seçin
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-col>
          <b-col md="2" cols="12">
            <b-form-datepicker
              locale="tr"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }"
              v-model="startDate"
              :max="endDate || new Date().toISOString().split('T')[0]"
              :required="mapType === 'route'"
            >
            </b-form-datepicker>
          </b-col>
          <b-col md="2" cols="12">
            <b-form-datepicker
              locale="tr"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }"
              v-model="endDate"
              :min="startDate"
              :max="new Date().toISOString().split('T')[0]"
              :required="mapType === 'route'"
            >
            </b-form-datepicker>
          </b-col>
          <b-col md="1" cols="12">
            <b-form-group>
              <b-form-radio-group v-model="mapType" name="mapType">
                <b-form-radio value="location">
                  Konum
                </b-form-radio>
                <b-form-radio value="route" :disabled="!formVehicle">
                  Rota
                </b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-col>
          <b-col md="3" cols="12">
            <b-row>
              <b-col>
                <b-button
                  :variant="!isSearchDisabled ? 'primary' : 'ghost'"
                  block
                  @click="onGetItems"
                  :disabled="isSearchDisabled"
                >
                  Ara
                </b-button>
              </b-col>
              <b-col>
                <b-button block v-b-modal.modal-center> Sorgula </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-form>
        <div class="row">
          <div class="col-12">
            <GmapMap
              :center="mapCenter"
              :zoom="mapZoom"
              map-type-id="terrain"
              style="width: 100%; height: 500px"
              :options="mapOptions"
              ref="mapRef"
            />
          </div>
        </div>
      </b-col>
      <b-col class="col-12 bg-white p-4">
        <div class="row">
          <b-row>
            <b-card class="col-12" v-if="selectedItem">
              <div class="row car-info">
                <div class="col-12 px-3 py-2 car-info-title">
                  <strong><i class="fa fa-car-alt mr-2"></i> Plaka :</strong>
                </div>
                <div class="col-12 pr-3 py-2 pl-5 mb-3 car-info-val">
                  {{ selectedItemData.vehicle.Plaque }}
                </div>

                <div class="col-12 px-3 py-2 car-info-title">
                  <strong>
                    <i class="fa fa-tachometer-alt mr-2"></i> Hız :</strong
                  >
                </div>
                <div class="col-12 pr-3 py-2 pl-5 mb-3 car-info-val">
                  {{ selectedItemData.Speed }} km/s
                </div>

                <div class="col-12 px-3 py-2 car-info-title">
                  <strong>
                    <i class="fa fa-map-marker-alt mr-2"></i> Son Bekleme :
                  </strong>
                </div>
                <div class="col-12 pr-3 py-2 pl-5 car-info-val">
                  {{ selectedItemData.Latitude }},
                  {{ selectedItemData.Longitude }}
                </div>
              </div>
            </b-card>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import { mapActions, mapGetters, mapState } from "vuex";
import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
import { FETCH_VEHICLEDETAILS } from "../../store/modules/vehicleDetails";
export default {
  name: "mapView",
  components: {},
  props: {
    companyId: { default: null },
    vehicleId: { default: null },
    maptype: { default: "route" }
  },
  data() {
    return {
      title: "Harita",
      mapZoom: 6,
      mapCenter: { lat: 38.5603058, lng: 35.0688108 },
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      fields: [
        { options: "company", optionName: "CompanyName" },
        {
          options: "vehicle",
          optionName: "Plaque"
        },
        {
          options: "driver",
          optionName: "DriverName"
        }
      ],
      selectedItem: null,
      startDate: null,
      endDate: null,
      formCompany: this.companyId,
      formVehicle: this.vehicleId,
      mapType: this.maptype,
      Map: null,
      Markers: [],
      drawingCircle: null,
      circle: null
    };
  },
  computed: {
    google: gmapApi,
    ...mapState({
      items: state => state.vehicleDetails.items,
      errors: state => state.vehicleDetails.errors
    }),
    ...mapGetters({
      vehicle: "getVehicles",
      company: "getCompanies",
      driver: "getDrivers",
      getVehicleByCompanyId: "getVehicleByCompanyId",
      getVehicleLocationsDetailsById: "getVehicleLocationsDetailsById"
    }),
    formVehicleOptions() {
      return (this.formCompany !== null
        ? this.getVehicleByCompanyId(this.formCompany)
        : []
      ).map(v => ({
        value: v.Id,
        text: v.Plaque
      }));
    },
    formCompanyOptions() {
      return this.options.company.map(v => ({
        value: v.Id,
        text: v.CompanyName
      }));
    },

    optionsList() {
      return this.fields
        .filter(field => field.hasOwnProperty("options"))
        .map(field => field.options);
    },
    options() {
      return this.optionsList.reduce((p, n) => {
        p[n] = this[n];
        return p;
      }, {});
    },
    selectedItemData() {
      const vehicle = this.vehicle.find(
        v => v.Id === this.selectedItem.VehicleId
      );
      const driver = this.driver.find(v => v.Id === this.selectedItem.DriverId);
      return Object.assign({}, this.selectedItem, { vehicle }, { driver });
    },
    isSearchDisabled() {
      return (
        !this.formCompany ||
        (this.formVehicle &&
          this.mapType === "route" &&
          !(this.startDate && this.endDate))
      );
    }
  },
  methods: {
    ...mapActions({
      fetchItems: FETCH_VEHICLEDETAILS,
      setBreadCrumb: SET_BREADCRUMB
    }),
    fetchOptions() {
      this.optionsList.forEach(option => {
        const actionName = `FETCH_${option.toUpperCase()}`;
        this.$store.dispatch(actionName);
      });
    },
    onCompanySelect() {
      this.mapType = "location";
      this.formVehicle = null;
      this.circle && this.circle.setMap(null);
    },
    onVehicleSelect(e) {
      this.mapType = e ? "route" : "location";
    },
    onGetItems() {
      if (
        (this.vehicleId || this.formVehicle) &&
        this.startDate === null &&
        this.endDate === null &&
        this.mapType === "location"
      ) {
        //live trackmode
        this.setCurrentItem(null);
        const vehicleDetail = this.getVehicleLocationsDetailsById(
          this.vehicleId || this.formVehicle
        );
        this.Markers.forEach(marker => marker.setMap(null));

        const position = new this.google.maps.LatLng(
          vehicleDetail.latitude,
          vehicleDetail.longitude
        );

        let marker = new this.google.maps.Marker({
          position,
          animation: this.google.maps.Animation.DROP
        });

        this.Map.setCenter(position);


        marker && marker.setMap(this.Map);
      } else {
        this.fetchItems({
          StartDate: this.startDate,
          EndDate: this.endDate,
          CompanyId: this.formCompany,
          VehicleId: this.formVehicle,
          type: this.mapType,
          Longitude: this.circle ? this.circle.getCenter().lng() : null,
          Latitude: this.circle ? this.circle.getCenter().lat() : null,
          Radius: this.circle ? this.circle.getRadius() / (110 * 1000) : null
        })
          .then(() => {
            this.setCurrentItem(null);
            let s = null,
              w = null,
              n = null,
              e = null;
            this.items.forEach(item => {
              if (!s) s = item.Latitude;
              else if (s > item.Latitude) s = item.Latitude;
              if (!n) n = item.Latitude;
              else if (n < item.Latitude) n = item.Latitude;
              if (!w) w = item.Longitude;
              else if (w > item.Longitude) w = item.Longitude;
              if (!e) e = item.Longitude;
              else if (e > item.Longitude) e = item.Longitude;
            });
            if (this.items.length === 0) {
              s = 38.9637451;
              w = 35.2433205;
              n = 38.9637451;
              e = 35.2433205;
              this.Map.setZoom(6);
            } else {
              this.Map.setZoom(12);
            }
            this.Map.setCenter(
              new this.google.maps.LatLng((n + s) / 2, (e + w) / 2)
            );
            this.Map.panToBounds(
              new this.google.maps.LatLngBounds(
                new this.google.maps.LatLng(s, w),
                new this.google.maps.LatLng(n, e)
              )
            );
            this.directionsRenderer.setMap(null);
            this.Markers.forEach(marker => marker.setMap(null));
            if (this.mapType === "route" && this.formVehicle) this.setRoute();
            if (["location", "circle"].includes(this.mapType)) {
              this.items.forEach(item => {
                let marker = new this.google.maps.Marker({
                  position: new this.google.maps.LatLng(
                    item.Latitude,
                    item.Longitude
                  ),

                  animation: this.google.maps.Animation.DROP
                });
                marker.setMap(this.Map);
                marker.addListener("click", () => {
                  if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                    this.setCurrentItem(null);
                  } else {
                    this.setCurrentItem(item);
                    this.Markers.forEach(marker => marker.setAnimation(null));
                    marker.setAnimation(this.google.maps.Animation.BOUNCE);
                  }
                });

                this.Markers.push(marker);
              });
            }
          })
          .catch(() => {
            Array.isArray(this.errors) &&
              this.errors.forEach(err => {
                this.$toastr.error(err);
              });
          });
      }
    },
    setCurrentItem(v) {
      this.selectedItem = v;
    },
    setRoute() {
      if (!this.items.length > 0) return;
      const firstStep = this.items[0],
        lastStep = this.items[this.items.length - 1],
        origin = new this.google.maps.LatLng(
          firstStep.Latitude,
          firstStep.Longitude
        ),
        destination = new this.google.maps.LatLng(
          lastStep.Latitude,
          lastStep.Longitude
        );
      this.directionsService.route(
        {
          origin,
          destination,
          waypoints: this.items.map(item => ({
            location: new this.google.maps.LatLng(
              item.Latitude,
              item.Longitude
            ),
            stopover: false
          })),
          optimizeWaypoints: true,
          travelMode: "DRIVING"
        },
        (response, status) => {
          if (status === "OK") {
            this.directionsRenderer.setDirections(response);
            this.directionsRenderer.setMap(this.Map);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    },
    onManuelSelect() {
      if (this.circle) this.circle.setMap(null);
      this.circle = new this.google.maps.Circle({
        center: this.drawingCircle.getCenter(),
        radius: this.drawingCircle.getRadius(),
        draggable: false,
        editable: false,
        strokeColor: "#ccc",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#ccc",
        fillOpacity: 0.35
      });
      this.circle.setMap(this.Map);
      this.resetForm();
      this.mapType = "circle";
      this.onGetItems();
    },
    registerDrawEvents() {
      this.DrawMap.addListener("click", e => {
        this.drawCircle(e);
      });
    },
    drawCircle(e) {
      if (this.drawingCircle) this.drawingCircle.setMap(null);
      this.drawingCircle = new this.google.maps.Circle({
        center: e.latLng,
        radius: 2e4,
        draggable: true,
        editable: true
      });
      this.drawingCircle.setMap(this.DrawMap);
    },
    resetForm() {
      this.formCompany = null;
      this.formVehicle = null;
      this.startDate = null;
      this.endDate = null;
      this.mapType = "route";
    }
  },
  mounted() {
    this.setBreadCrumb([
      {
        title: this.title,
        route: this.$router.route
      }
    ]);
    this.fetchOptions();
    this.$refs.mapRef.$mapPromise.then(map => {
      this.Map = map;
      this.directionsService = new this.google.maps.DirectionsService();
      this.directionsRenderer = new this.google.maps.DirectionsRenderer();
    });
    this.$refs.drawMapRef.$mapPromise.then(map => {
      this.DrawMap = map;
      this.registerDrawEvents();
    });
  }
};
</script>

<style scoped></style>
