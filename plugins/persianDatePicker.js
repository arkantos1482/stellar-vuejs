import Vue from 'vue'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

Vue.use(VuePersianDatetimePicker, {
    name: 'custom-date-picker',
    props: {
        inputFormat: 'YYYY-MM-DD',
        format: "YYYY-MM-DD",
        displayFormat: "jDD jMMMM jYYYY",
        editable: false,
        inputClass: 'persian-date-picker',
        placeholder: '',
        clearable: true,
        // altFormat: 'YYYY-MM-DD HH:mm',
        color: '#ffbb00',
        autoSubmit: false,
        //...
        //... And whatever you want to set as default
        //...
    }
});