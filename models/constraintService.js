import Vue from "vue"

const state = Vue.observable({list: []})

export const init = axios => {
    axios.$get('/constraints')
        .then(res => state.list = res.data)
};

export const withdrawConstraints = () => state.list
    .filter(i => i.type === 'withdraw')
    .map(i => i.resource)

export const depositConstraints = () => state.list
    .filter(i => i.type === 'deposit')
    .map(i => i.resource.toUpperCase())

export const offerConstraints = () => state.list
    .filter(i => i.type === 'offer')
    .map(i => i.resource.toUpperCase())

