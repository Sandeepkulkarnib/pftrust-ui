import {GET_ACCOUNT_VIEW_PERMISSIONS} from "@/store/modules/adminstration/types";

export default {
    [GET_ACCOUNT_VIEW_PERMISSIONS] (state) {

        if(state.permissions === null || state.permissions.length < 1){
            return []
        }

        let permission = state.permissions.find(permission => {
            if(permission.type === 'account'){
                return permission;
            }
        });

        return state.accountViewNavigation.filter(item => permission.permissions.includes(item.type.toUpperCase()))
    }
}