import colors from 'vuetify/es5/util/colors'

export default {
    // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
    ssr: false,

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        titleTemplate: '%s',
        title: 'Bitra',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },

    server: {
        port: 8000, // default: 3000
        host: '0.0.0.0' // default: localhost
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        '~/assets/main.css'
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: ['~/plugins/filters.js', '~/plugins/components.js'
        , '~/plugins/axiosAuth.js', '~/plugins/recaptcha.js', '~/plugins/eventbus.js'],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
    ],

    router: {
        base: '/app/',
        middleware: ['auth']
    },

    publicRuntimeConfig: {
        baseURL: process.env.BASE_URL
    },
    privateRuntimeConfig: {
        apiSecret: process.env.API_SECRET
    },
    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {
        baseURL: process.env.BASE_URL,
        credentials: true,
        progress: false
    },

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        treeShake: true,
        defaultAssets: {
            font: {
                family: 'IranSans'
            }
        },
        customVariables: ['~/assets/variables.scss'],
        rtl: true,
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: '#0074ff',
                    accent: colors.grey.darken3,
                    secondary: '#001254',
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    // error: colors.deepOrange.accent4,
                    // success: colors.green.accent3,
                    error: '#F84960',
                    errorBack: '#F849601E',
                    success: '#02c076',
                    successBack: '#02c0761E'
                }
            }
        }
    },

    generate: {
        dir: 'dist/app'
    },
    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        // extend(config, {isDev}) {
        //     if (!isDev) {
        //         config.output.publicPath = '/_nuxt/'
        //     }
        // }
    }
}
