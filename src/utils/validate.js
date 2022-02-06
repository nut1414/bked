export const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

export const validateUsername = (username) => {
    const re = /^[A-Za-z][A-Za-z0-9_]$/
    return re.test(username)
}