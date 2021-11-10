import Vue from "vue"

export const refresh = axios => {
    axios.$get('/welcome-messages')
        .then(res => state.list = res.data);
}

const state = Vue.observable({list: []})

// export const banners = type => state.list.filter(i => i.type === type)

export const banners = (page) => state.list.filter(i => i.type.includes(page))