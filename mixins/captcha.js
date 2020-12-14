export default {
    data() {
        return {
            captcha_token: ''
        }
    },
    async mounted() {
        // (optional) Wait until recaptcha has been loaded.
        await this.$recaptchaLoaded()
        this.$recaptchaInstance.showBadge()
    },
    methods: {
        async getCaptcha() {
            this.captcha_token = await this.$recaptcha('login')
        }
    },
    beforeDestroy() {
        this.$recaptchaInstance.hideBadge()
    }
}