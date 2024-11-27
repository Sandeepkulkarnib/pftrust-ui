export const isNumber = (v, message) => {
    if(!(/^\d+$/.test(v))){
        return message
    }
    return true
}
export const isNotEmpty = (v, message) => {
    if(v === null || v === undefined || v === ""){
        return message
    }
    return true
}
export const shouldBeGreaterThan = (v, test, message) => {
    if(v > parseFloat(test)){
        return true
    }
    return message
}
export const shouldBeLessThan = (v, test, message) => {
    if(v < parseFloat(test)){
        return true
    }
    return message
}
export const shouldBeEqualTo = (v, test, message) => {
    if(v === parseFloat(test)){
        return true
    }
    return message
}
export const validPern = (v, message) => {
    if(!(/^9\d{7}$/.test(v))){
        return message
    }
    return true
}
export const validMobileNumber = (v, message) => {
    if(!(/^\d{10}$/.test(v))){
        return message
    }
    return true
}
export const validEmailId = (v, message) => {
    if(!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v))){
        return message
    }
    return true
}
export const validIfscCode = (v, message) => {
    if(!(/^[a-zA-Z]{4}0\d{6}$/.test(v))){
        return message
    }
    return true
}
export const validMicrCode = (v, message) => {
    if(!(/^\d{9}$/.test(v))){
        return message
    }
    return true
}

export const isDecimal = (v, message) => {
    if(!( /^\d*.\d*$/.test(v))){
        return message
    }
    return true
}
export const isNotNumber = (v, message) => {
    if((/^\d+$/.test(v))){
        return message
    }
    return true
}
export const validMemberId = (v, message) => {
    if(!(/^[a-zA-Z0-9]{22}$/.test(v))){
        return message
    }
    return true
}