export default {
    errorCaptured(err, vm, info) {
        console.log('errrror captured')
        console.log(err.response)
        for (let item of Object.keys(this.l)) {
            this.l[item] = false
        }
    }
}