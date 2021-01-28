export default {
    errorCaptured(err, vm, info) {
        for (let item of Object.keys(this.l)) {
            this.l[item] = false
        }
    }
}