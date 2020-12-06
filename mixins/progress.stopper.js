export default {
    errorCaptured(err, vm, info) {
        console.log('errrror captured')
        for (let item of Object.keys(this.l)) {
            this.l.item = false
        }
    }
}