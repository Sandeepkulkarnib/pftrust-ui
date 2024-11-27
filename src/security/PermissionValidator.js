
class PermissionValidator {

    constructor(store) {
        this.store = store
    }

    can(to, from, next){
        this.store.dispatch("administrationModule/validatePermission", to.path)
            .then(() => {
                console.log("success")
                next()
            })
            .catch(error => {
                console.log(error)
                next()
            })
    }

}

export default {

    install(Vue, store){
        const validator = new PermissionValidator(store)
        Vue.validator = validator
        Vue.prototype.$validator = validator
    }

}