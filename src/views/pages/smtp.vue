<template>
    <div>
        <transition name="fade">
            <b-form @submit.prevent="onSubmit">
                <b-row>
                    <b-col>
                        <h3>{{title}}</h3>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col v-for="(field, index) in fields" :key="index" md="4">
                        <b-form-group>
                            <template>
                                <b-form-input
                                        :type="field.type"
                                        :required="field.required"
                                        :placeholder="field.label"
                                        :value="item.length > 0 ? item[0][field.key] : ''"
                                ></b-form-input>
                            </template>
                        </b-form-group>
                    </b-col>
                </b-row>
                <template>
                    <b-btn variant="primary" type="submit" class="ml-1">{{method === 'CREATE_SMTP' ? 'Kaydet' : 'Güncelle'}}</b-btn>
                </template>
            </b-form>
        </transition>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapState } from "vuex";
    import { SET_BREADCRUMB } from "../../store/breadcrumbs.module";
    import {CREATE_SMTP, DELETE_SMTP, FETCH_SMTP, SAVE_SMTP} from "../../store/modules/smtp";
    export default {
        name: "smtp",
        data() {
            return {
                title: "Smtp Ayarları",
                fetching: false,
                method: 'SAVE_SMTP',
                fields: [
                    {
                        key: "Email",
                        label: "Smtp E-posta",
                        sortable: true,
                        type: "email",
                        required: true,
                        enableSsl: true
                    },
                    {
                        key: "Password",
                        label: "Parola",
                        sortable: true,
                        type: "password",
                        required: true,
                        enableSsl: true
                    },
                    {
                        key: "Port",
                        label: "Smtp Port",
                        sortable: true,
                        type: "number",
                        required: true,
                        enableSsl: true
                    },
                    {
                        key: "Host",
                        label: "Smtp Host",
                        sortable: true,
                        type: "text",
                        required: true,
                        enableSsl: true
                    },

                ],
                selectedItem: null,
                selectedItemEditable: false,
                isCreate: false
            };
        },
        methods: {
            ...mapActions({
                fetchItems: FETCH_SMTP,
                setBreadCrumb: SET_BREADCRUMB,
                saveItem: SAVE_SMTP,
                createItem: CREATE_SMTP,
                deleteItem: DELETE_SMTP
            }),
            onSubmit() {
                const self = this;
                self.$store.dispatch(this.method)
            },
            actionControl() {
                const self = this;
                if (self.item.length > 0) {
                    self.method = 'CREATE_SMTP'
                } else {
                    self.method = 'SAVE_SMTP'
                }
            }
        },
        computed: {
            ...mapState({
                item: state => state.smtp.items
            }),
            ...mapGetters({
                getSmtp: "getSmtp",
            }),
        },
        beforeCreate() {
            const self = this;
            self.$store.dispatch('FETCH_SMTP')

        },
        created() {
            const self = this;
            self.actionControl()
            console.log(self.getSmtp)

        }
    }
</script>

<style scoped>

</style>
