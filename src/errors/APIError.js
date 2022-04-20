export default class APIError extends Error {
    constructor(message = 'Internal Server Error',
                statuscode = 500){
        super(message)
        this.message = message
        this.statuscode = statuscode
    }
}