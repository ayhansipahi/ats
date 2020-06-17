<template>
  <div>
    <!--begin::Head-->
    <div class="kt-login__head">
      <span class="kt-login__signup-label">{{
        $t("AUTH.GENERAL.NO_ACCOUNT")
      }}</span
      >&nbsp;&nbsp;
      <router-link
        class="kt-link kt-login__signup-link"
        :to="{ name: 'register' }"
      >
        {{ $t("AUTH.GENERAL.SIGNUP_BUTTON") }}
      </router-link>
    </div>
    <!--end::Head-->

    <!--begin::Body-->
    <div class="kt-login__body">
      <!--begin::Signin-->
      <div class="kt-login__form">
        <div class="kt-login__title">
          <h3>Giriş</h3>
        </div>

        <!--begin::Form-->
        <b-form class="kt-form" @submit.stop.prevent="onSubmit">
          <div v-if="false" role="alert" class="alert alert-info">
            <div class="alert-text">
              Use account <strong>admin@demo.com</strong> and password
              <strong>demo</strong> to continue.
            </div>
          </div>

          <div
            role="alert"
            v-bind:class="{ show: errors.length }"
            class="alert fade alert-danger"
          >
            <div class="alert-text" v-for="(error, i) in errors" :key="i">
              {{ error }}
            </div>
          </div>

          <b-form-group
            id="example-input-group-1"
            label="Kullanıcı Adı"
            label-for="example-input-1"
          >
            <b-form-input
              id="example-input-1"
              name="example-input-1"
              v-model="$v.form.userName.$model"
              :state="validateState('userName')"
              aria-describedby="input-1-live-feedback"
            ></b-form-input>

            <b-form-invalid-feedback id="input-1-live-feedback">
              Kullanıcı adı gerekli
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="example-input-group-2"
            label="Şifre"
            label-for="example-input-2"
          >
            <b-form-input
              type="password"
              id="example-input-2"
              name="example-input-2"
              v-model="$v.form.password.$model"
              :state="validateState('password')"
              aria-describedby="input-2-live-feedback"
            ></b-form-input>

            <b-form-invalid-feedback id="input-2-live-feedback">
              Şifre gerekli
            </b-form-invalid-feedback>
          </b-form-group>

          <!--begin::Action-->
          <div class="kt-login__actions">
            <a v-if="false" href="#" class="kt-link kt-login__link-forgot">
              {{ $t("AUTH.FORGOT.TITLE") }}
            </a>
            <b-button
              type="submit"
              id="kt_submit"
              class="btn btn-primary btn-elevate kt-login__btn-primary"
            >
              {{ $t("AUTH.LOGIN.BUTTON") }}
            </b-button>
          </div>
          <!--end::Action-->
        </b-form>
        <!--end::Form-->
      </div>
      <!--end::Signin-->
    </div>
    <!--end::Body-->
  </div>
</template>

<style lang="scss" scoped>
.kt-spinner.kt-spinner--right:before {
  right: 8px;
}
</style>

<script>
import { mapState } from "vuex";
import { LOGOUT } from "../../../store/auth.module";
// import { LOGIN, LOGOUT } from "../../../store/auth.module";

import { validationMixin } from "vuelidate";
import { minLength, required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "login",
  data() {
    return {
      // Remove this dummy login info
      form: {
        userName: "admin",
        password: "admin123"
      }
    };
  },
  validations: {
    form: {
      userName: {
        required
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        userName: null,
        password: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      //const userName = this.$v.form.userName.$model;
      //const password = this.$v.form.password.$model;

      // clear existing errors
      this.$store.dispatch(LOGOUT);

      // set spinner to submit button
      const submitButton = document.getElementById("kt_submit");
      submitButton.classList.add(
        "kt-spinner",
        "kt-spinner--light",
        "kt-spinner--right"
      );

      return this.$router.push({ name: "map" });
      // send login request
      /*this.$store
        .dispatch(LOGIN, { userName, password })
        // go to which page after successfully login
        .then(response => {
          if( response.IsSuccess) this.$router.push({ name: "map" });
        })
        .catch(() => {})
        .finally(() => {
          submitButton.classList.remove(
            "kt-spinner",
            "kt-spinner--light",
            "kt-spinner--right"
          );
        });*,
        7
       */
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    backgroundImage() {
      return process.env.BASE_URL + "assets/media/bg/bg-4.jpg";
    }
  }
};
</script>
